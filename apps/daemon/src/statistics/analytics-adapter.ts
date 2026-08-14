import crypto from 'node:crypto';
import type Database from 'better-sqlite3';
import type { StatisticCategory, StatisticEventInput } from '@open-design/contracts';
import type { AnalyticsContext, AnalyticsService } from '../analytics.js';
import { insertStatisticEvents } from './persistence.js';

const CATEGORY_BY_PREFIX: Array<[RegExp, StatisticCategory]> = [
  [/^run_/, 'run'], [/^project_/, 'project'], [/artifact|sketch|file_version/, 'artifact'],
  [/export|deploy|publish/, 'export'], [/plugin/, 'plugin'], [/media|image|video|speech/, 'media'],
  [/automation|routine/, 'automation'], [/design_system/, 'design_system'], [/workspace|invite|member/, 'workspace'],
];

export function createLocalStatisticsAnalyticsService(db: Database.Database): AnalyticsService {
  return {
    capture: async ({ eventName, context, properties, insertId }) => {
      const event = statisticEventFromAnalytics(eventName, properties, context, insertId);
      insertStatisticEvents(db, [event]);
    },
    // Crash stacks, exception messages, and early-startup diagnostics are not
    // usage statistics. Keep ordinary local logs as the diagnostic surface.
    captureSafety: async () => undefined,
    mergeAnonymousPerson: async () => undefined,
    identifyGroup: async () => undefined,
    shutdown: async () => undefined,
  };
}

function statisticEventFromAnalytics(
  eventName: string,
  properties: Record<string, unknown>,
  context: AnalyticsContext,
  insertId: string,
): StatisticEventInput {
  const category = CATEGORY_BY_PREFIX.find(([pattern]) => pattern.test(eventName))?.[1] ?? 'feature';
  const toolNames = Array.isArray(properties.tool_names)
    ? properties.tool_names.filter((value): value is string => typeof value === 'string')
    : typeof properties.tool_names_csv === 'string'
      ? properties.tool_names_csv.split(',').map((value) => value.trim()).filter(Boolean)
      : [];
  return {
    id: insertId || crypto.randomUUID(),
    occurredAt: Date.now(),
    name: eventName,
    category,
    source: context.clientType === 'external_mcp' ? 'cli' : 'daemon',
    projectId: stringValue(properties.project_id),
    workspaceId: stringValue(properties.workspace_id),
    modelId: stringValue(properties.model_id),
    providerId: stringValue(properties.agent_provider_id ?? properties.provider_id),
    feature: stringValue(properties.feature ?? properties.area ?? properties.element) ?? eventName,
    result: stringValue(properties.result ?? properties.status ?? properties.run_result),
    durationMs: numberValue(properties.duration_ms ?? properties.total_duration_ms),
    inputTokens: numberValue(properties.input_tokens),
    outputTokens: numberValue(properties.output_tokens),
    totalTokens: numberValue(properties.total_tokens),
    toolNames,
  };
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 128) : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}
