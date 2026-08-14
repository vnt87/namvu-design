import type Database from 'better-sqlite3';
import {
  STATISTIC_CATEGORIES,
  STATISTIC_RANGES,
  type StatisticBreakdownItem,
  type StatisticCategory,
  type StatisticEventInput,
  type StatisticEventRecord,
  type StatisticFilters,
  type StatisticsDashboardResponse,
  type StatisticsEventsResponse,
} from '@open-design/contracts';

type SqliteDb = Database.Database;
type Row = Record<string, unknown>;

const MAX_TEXT = 128;
const MAX_TOOLS = 32;
const SAFE_TEXT = /^[\p{L}\p{N} ._:@/+\-]+$/u;

export function migrateStatistics(db: SqliteDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS statistic_events (
      id TEXT PRIMARY KEY,
      occurred_at INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      source TEXT NOT NULL,
      project_id TEXT,
      workspace_id TEXT,
      model_id TEXT,
      provider_id TEXT,
      feature TEXT,
      result TEXT,
      duration_ms INTEGER,
      input_tokens INTEGER,
      output_tokens INTEGER,
      total_tokens INTEGER,
      tool_names_json TEXT NOT NULL DEFAULT '[]',
      event_count INTEGER NOT NULL DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS idx_statistic_events_time
      ON statistic_events(occurred_at DESC, id DESC);
    CREATE INDEX IF NOT EXISTS idx_statistic_events_project
      ON statistic_events(project_id, occurred_at DESC);
    CREATE INDEX IF NOT EXISTS idx_statistic_events_workspace
      ON statistic_events(workspace_id, occurred_at DESC);
    CREATE INDEX IF NOT EXISTS idx_statistic_events_dimensions
      ON statistic_events(category, feature, model_id, provider_id, result, occurred_at DESC);
  `);
}

export function normalizeStatisticEvent(value: unknown): StatisticEventInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const id = cleanText(input.id);
  const name = cleanText(input.name);
  const category = cleanCategory(input.category);
  const source = input.source === 'daemon' || input.source === 'cli' ? input.source : input.source === 'web' ? 'web' : null;
  const occurredAt = finiteInteger(input.occurredAt);
  if (!id || !name || !category || !source || occurredAt === null) return null;
  if (occurredAt < 0 || Math.abs(Date.now() - occurredAt) > 366 * 24 * 60 * 60 * 1000) return null;
  const event: StatisticEventInput = { id, name, category, source, occurredAt };
  for (const key of ['projectId', 'workspaceId', 'modelId', 'providerId', 'feature', 'result'] as const) {
    const cleaned = cleanText(input[key]);
    if (cleaned) event[key] = cleaned;
  }
  for (const key of ['durationMs', 'inputTokens', 'outputTokens', 'totalTokens'] as const) {
    const cleaned = nonNegativeInteger(input[key]);
    if (cleaned !== null) event[key] = cleaned;
  }
  const count = nonNegativeInteger(input.count);
  if (count !== null && count > 0) event.count = Math.min(count, 1_000_000);
  if (Array.isArray(input.toolNames)) {
    event.toolNames = Array.from(new Set(input.toolNames.map(cleanText).filter((item): item is string => Boolean(item)))).slice(0, MAX_TOOLS);
  }
  return event;
}

export function insertStatisticEvents(db: SqliteDb, values: unknown[]): { accepted: number; ignored: number } {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO statistic_events (
      id, occurred_at, name, category, source, project_id, workspace_id,
      model_id, provider_id, feature, result, duration_ms, input_tokens,
      output_tokens, total_tokens, tool_names_json, event_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  let accepted = 0;
  let ignored = 0;
  const transaction = db.transaction((items: unknown[]) => {
    for (const value of items) {
      const event = normalizeStatisticEvent(value);
      if (!event) {
        ignored += 1;
        continue;
      }
      const result = insert.run(
        event.id, event.occurredAt, event.name, event.category, event.source,
        event.projectId ?? null, event.workspaceId ?? null, event.modelId ?? null,
        event.providerId ?? null, event.feature ?? null, event.result ?? null,
        event.durationMs ?? null, event.inputTokens ?? null, event.outputTokens ?? null,
        event.totalTokens ?? null, JSON.stringify(event.toolNames ?? []), event.count ?? 1,
      );
      if (result.changes > 0) accepted += 1;
      else ignored += 1;
    }
  });
  transaction(values);
  return { accepted, ignored };
}

export function getStatisticsDashboard(db: SqliteDb, filters: StatisticFilters): StatisticsDashboardResponse {
  const { where, params } = buildWhere(filters);
  const rows = db.prepare(`SELECT * FROM statistic_events ${where} ORDER BY occurred_at ASC`).all(...params) as Row[];
  let events = 0;
  let runs = 0;
  let succeeded = 0;
  let failed = 0;
  let canceled = 0;
  let totalTokens = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let durationMs = 0;
  let artifacts = 0;
  const features = new Set<string>();
  const buckets = new Map<string, { events: number; runs: number; succeeded: number; failed: number; totalTokens: number; durationMs: number }>();
  const breakdownMaps = {
    results: new Map<string, StatisticBreakdownItem>(),
    models: new Map<string, StatisticBreakdownItem>(),
    providers: new Map<string, StatisticBreakdownItem>(),
    tools: new Map<string, StatisticBreakdownItem>(),
    features: new Map<string, StatisticBreakdownItem>(),
  };
  for (const row of rows) {
    const count = number(row.event_count, 1);
    const rowTokens = number(row.total_tokens);
    const rowDuration = number(row.duration_ms);
    const category = String(row.category);
    const result = textValue(row.result);
    events += count;
    totalTokens += rowTokens;
    inputTokens += number(row.input_tokens);
    outputTokens += number(row.output_tokens);
    durationMs += rowDuration;
    if (category === 'run') {
      runs += count;
      if (result === 'succeeded' || result === 'success') succeeded += count;
      else if (result === 'failed' || result === 'error') failed += count;
      else if (result === 'canceled' || result === 'cancelled') canceled += count;
    }
    if (category === 'artifact' || category === 'export') artifacts += count;
    const feature = textValue(row.feature) ?? String(row.name);
    features.add(feature);
    const date = new Date(number(row.occurred_at)).toISOString().slice(0, 10);
    const bucket = buckets.get(date) ?? { events: 0, runs: 0, succeeded: 0, failed: 0, totalTokens: 0, durationMs: 0 };
    bucket.events += count;
    bucket.runs += category === 'run' ? count : 0;
    bucket.succeeded += category === 'run' && (result === 'succeeded' || result === 'success') ? count : 0;
    bucket.failed += category === 'run' && (result === 'failed' || result === 'error') ? count : 0;
    bucket.totalTokens += rowTokens;
    bucket.durationMs += rowDuration;
    buckets.set(date, bucket);
    addBreakdown(breakdownMaps.results, result, count, rowTokens, rowDuration);
    addBreakdown(breakdownMaps.models, textValue(row.model_id), count, rowTokens, rowDuration);
    addBreakdown(breakdownMaps.providers, textValue(row.provider_id), count, rowTokens, rowDuration);
    addBreakdown(breakdownMaps.features, feature, count, rowTokens, rowDuration);
    for (const tool of parseTools(row.tool_names_json)) addBreakdown(breakdownMaps.tools, tool, count, 0, 0);
  }
  return {
    generatedAt: Date.now(),
    filters,
    summary: {
      events, runs, succeeded, failed, canceled,
      successRate: runs > 0 ? succeeded / runs : null,
      totalTokens, inputTokens, outputTokens, durationMs, artifacts,
      featuresUsed: features.size,
    },
    timeline: Array.from(buckets, ([date, bucket]) => ({ date, ...bucket })),
    breakdowns: {
      results: sortedBreakdown(breakdownMaps.results),
      models: sortedBreakdown(breakdownMaps.models),
      providers: sortedBreakdown(breakdownMaps.providers),
      tools: sortedBreakdown(breakdownMaps.tools),
      features: sortedBreakdown(breakdownMaps.features),
    },
    availableFilters: {
      projectIds: distinctStrings(db, 'project_id'),
      workspaceIds: distinctStrings(db, 'workspace_id'),
      modelIds: distinctStrings(db, 'model_id'),
      providerIds: distinctStrings(db, 'provider_id'),
      features: distinctStrings(db, 'feature'),
      categories: distinctStrings(db, 'category').filter((value): value is StatisticCategory => (STATISTIC_CATEGORIES as readonly string[]).includes(value)),
      results: distinctStrings(db, 'result'),
    },
  };
}

export function listStatisticEvents(db: SqliteDb, filters: StatisticFilters, cursor: string | null, limit: number): StatisticsEventsResponse {
  const built = buildWhere(filters, cursor);
  const rows = db.prepare(`SELECT * FROM statistic_events ${built.where} ORDER BY occurred_at DESC, id DESC LIMIT ?`).all(...built.params, limit + 1) as Row[];
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  return {
    items: page.map(rowToEvent),
    nextCursor: hasMore && page.length > 0
      ? `${String(page[page.length - 1]?.occurred_at ?? '')}:${String(page[page.length - 1]?.id ?? '')}`
      : null,
  };
}

export function resetStatistics(db: SqliteDb): number {
  return db.prepare('DELETE FROM statistic_events').run().changes;
}

function buildWhere(filters: StatisticFilters, cursor?: string | null): { where: string; params: unknown[] } {
  const clauses: string[] = [];
  const params: unknown[] = [];
  const days = filters.range === '7d' ? 7 : filters.range === '30d' ? 30 : filters.range === '90d' ? 90 : null;
  if (days !== null) {
    clauses.push('occurred_at >= ?');
    params.push(Date.now() - days * 24 * 60 * 60 * 1000);
  }
  const columns: Array<[keyof StatisticFilters, string]> = [
    ['projectId', 'project_id'], ['workspaceId', 'workspace_id'], ['modelId', 'model_id'],
    ['providerId', 'provider_id'], ['feature', 'feature'], ['category', 'category'], ['result', 'result'],
  ];
  for (const [key, column] of columns) {
    const value = filters[key];
    if (typeof value === 'string' && value) { clauses.push(`${column} = ?`); params.push(value); }
  }
  const parsedCursor = parseEventCursor(cursor);
  if (parsedCursor) {
    clauses.push('(occurred_at < ? OR (occurred_at = ? AND id < ?))');
    params.push(parsedCursor.occurredAt, parsedCursor.occurredAt, parsedCursor.id);
  }
  return { where: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

function parseEventCursor(cursor: string | null | undefined): { occurredAt: number; id: string } | null {
  if (!cursor) return null;
  const separator = cursor.indexOf(':');
  if (separator <= 0) return null;
  const occurredAt = Number(cursor.slice(0, separator));
  const id = cursor.slice(separator + 1);
  return Number.isFinite(occurredAt) && id ? { occurredAt, id } : null;
}

function rowToEvent(row: Row): StatisticEventRecord {
  return {
    id: String(row.id), occurredAt: number(row.occurred_at), name: String(row.name),
    category: String(row.category) as StatisticCategory, source: String(row.source) as StatisticEventRecord['source'],
    ...(textValue(row.project_id) ? { projectId: textValue(row.project_id) } : {}),
    ...(textValue(row.workspace_id) ? { workspaceId: textValue(row.workspace_id) } : {}),
    ...(textValue(row.model_id) ? { modelId: textValue(row.model_id) } : {}),
    ...(textValue(row.provider_id) ? { providerId: textValue(row.provider_id) } : {}),
    ...(textValue(row.feature) ? { feature: textValue(row.feature) } : {}),
    ...(textValue(row.result) ? { result: textValue(row.result) } : {}),
    durationMs: number(row.duration_ms), inputTokens: number(row.input_tokens), outputTokens: number(row.output_tokens),
    totalTokens: number(row.total_tokens), toolNames: parseTools(row.tool_names_json), count: number(row.event_count, 1),
  };
}

function cleanCategory(value: unknown): StatisticCategory | null {
  return typeof value === 'string' && (STATISTIC_CATEGORIES as readonly string[]).includes(value) ? value as StatisticCategory : null;
}
function cleanText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= MAX_TEXT && SAFE_TEXT.test(trimmed) ? trimmed : null;
}
function finiteInteger(value: unknown): number | null { return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null; }
function nonNegativeInteger(value: unknown): number | null { const n = finiteInteger(value); return n !== null && n >= 0 ? n : null; }
function number(value: unknown, fallback = 0): number { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function textValue(value: unknown): string | null { return typeof value === 'string' && value ? value : null; }
function parseTools(value: unknown): string[] { try { const parsed = JSON.parse(String(value ?? '[]')); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []; } catch { return []; } }
function addBreakdown(map: Map<string, StatisticBreakdownItem>, key: string | null, count: number, totalTokens: number, durationMs: number): void {
  if (!key) return;
  const item = map.get(key) ?? { key, label: key, count: 0, totalTokens: 0, durationMs: 0 };
  item.count += count; item.totalTokens += totalTokens; item.durationMs += durationMs; map.set(key, item);
}
function sortedBreakdown(map: Map<string, StatisticBreakdownItem>): StatisticBreakdownItem[] { return Array.from(map.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, 20); }
function distinctStrings(db: SqliteDb, column: string): string[] { return (db.prepare(`SELECT DISTINCT ${column} AS value FROM statistic_events WHERE ${column} IS NOT NULL AND ${column} != '' ORDER BY ${column}`).all() as Row[]).map((row) => String(row.value)); }

export function parseStatisticFilters(query: Record<string, unknown>): StatisticFilters {
  const range = typeof query.range === 'string' && (STATISTIC_RANGES as readonly string[]).includes(query.range) ? query.range as StatisticFilters['range'] : '30d';
  const filters: StatisticFilters = { range };
  for (const key of ['projectId', 'workspaceId', 'modelId', 'providerId', 'feature', 'result'] as const) {
    const value = cleanText(query[key]); if (value) filters[key] = value;
  }
  const category = cleanCategory(query.category); if (category) filters.category = category;
  return filters;
}
