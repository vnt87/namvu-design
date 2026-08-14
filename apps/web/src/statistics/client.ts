import type { StatisticCategory, StatisticEventInput } from '@open-design/contracts';
import { randomUUID } from '../utils/uuid';

const pending: StatisticEventInput[] = [];
let flushTimer: number | null = null;

const CATEGORY_BY_NAME: Array<[RegExp, StatisticCategory]> = [
  [/^run_/, 'run'], [/^project_/, 'project'], [/artifact|sketch|file_version|file_upload/, 'artifact'],
  [/export|deploy|publish/, 'export'], [/plugin/, 'plugin'], [/media|image|video|speech/, 'media'],
  [/automation|routine/, 'automation'], [/design_system/, 'design_system'], [/workspace|invite|member/, 'workspace'],
];

export function recordLocalStatistic(
  name: string,
  properties: Record<string, unknown>,
  options: { id?: string; occurredAt?: number; source?: 'web' | 'cli' } = {},
): void {
  if (typeof window === 'undefined') return;
  const event = toStatisticEvent(name, properties, options);
  pending.push(event);
  if (pending.length >= 25) {
    void flushLocalStatistics();
    return;
  }
  if (flushTimer === null) {
    flushTimer = window.setTimeout(() => void flushLocalStatistics(), 500);
  }
}

export async function flushLocalStatistics(): Promise<void> {
  if (typeof window === 'undefined' || pending.length === 0) return;
  if (flushTimer !== null) window.clearTimeout(flushTimer);
  flushTimer = null;
  const events = pending.splice(0, 50);
  try {
    const response = await fetch('/api/statistics/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true,
    });
    if (!response.ok) throw new Error('local statistics write failed');
  } catch {
    pending.unshift(...events);
    flushTimer = window.setTimeout(() => void flushLocalStatistics(), 2_000);
    return;
  }
  if (pending.length > 0) void flushLocalStatistics();
}

function toStatisticEvent(
  name: string,
  properties: Record<string, unknown>,
  options: { id?: string; occurredAt?: number; source?: 'web' | 'cli' },
): StatisticEventInput {
  const category = CATEGORY_BY_NAME.find(([pattern]) => pattern.test(name))?.[1] ?? 'feature';
  return {
    id: options.id ?? randomUUID(),
    occurredAt: options.occurredAt ?? Date.now(),
    name: safe(name) ?? 'feature_used',
    category,
    source: options.source ?? 'web',
    projectId: safe(properties.project_id),
    workspaceId: safe(properties.workspace_id),
    modelId: safe(properties.model_id),
    providerId: safe(properties.agent_provider_id ?? properties.provider_id),
    feature: safe(properties.feature ?? properties.area ?? properties.element) ?? safe(name),
    result: safe(properties.result ?? properties.status ?? properties.run_result),
    durationMs: metric(properties.duration_ms ?? properties.total_duration_ms),
    inputTokens: metric(properties.input_tokens),
    outputTokens: metric(properties.output_tokens),
    totalTokens: metric(properties.total_tokens),
    toolNames: tools(properties.tool_names ?? properties.tool_names_csv),
  };
}

function safe(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim().slice(0, 128);
  return text && /^[\p{L}\p{N} ._:@/+\-]+$/u.test(text) ? text : null;
}

function metric(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}

function tools(value: unknown): string[] {
  const input = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return Array.from(new Set(input.map(safe).filter((item): item is string => Boolean(item)))).slice(0, 32);
}
