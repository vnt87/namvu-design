export const STATISTIC_RANGES = ['7d', '30d', '90d', 'all'] as const;
export type StatisticRange = (typeof STATISTIC_RANGES)[number];

export const STATISTIC_CATEGORIES = [
  'run',
  'project',
  'artifact',
  'export',
  'plugin',
  'media',
  'automation',
  'design_system',
  'workspace',
  'feature',
] as const;
export type StatisticCategory = (typeof STATISTIC_CATEGORIES)[number];

export interface StatisticEventInput {
  id: string;
  occurredAt: number;
  name: string;
  category: StatisticCategory;
  source: 'web' | 'daemon' | 'cli';
  projectId?: string | null;
  workspaceId?: string | null;
  modelId?: string | null;
  providerId?: string | null;
  feature?: string | null;
  result?: string | null;
  durationMs?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  toolNames?: string[];
  count?: number;
}

export interface StatisticEventBatchRequest {
  events: StatisticEventInput[];
}

export interface StatisticEventBatchResponse {
  accepted: number;
  ignored: number;
}

export interface StatisticFilters {
  range: StatisticRange;
  projectId?: string;
  workspaceId?: string;
  modelId?: string;
  providerId?: string;
  feature?: string;
  category?: StatisticCategory;
  result?: string;
}

export interface StatisticBreakdownItem {
  key: string;
  label: string;
  count: number;
  totalTokens: number;
  durationMs: number;
}

export interface StatisticTimeBucket {
  date: string;
  events: number;
  runs: number;
  succeeded: number;
  failed: number;
  totalTokens: number;
  durationMs: number;
}

export interface StatisticEventRecord extends StatisticEventInput {}

export interface StatisticsDashboardResponse {
  generatedAt: number;
  filters: StatisticFilters;
  summary: {
    events: number;
    runs: number;
    succeeded: number;
    failed: number;
    canceled: number;
    successRate: number | null;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
    artifacts: number;
    featuresUsed: number;
  };
  timeline: StatisticTimeBucket[];
  breakdowns: {
    results: StatisticBreakdownItem[];
    models: StatisticBreakdownItem[];
    providers: StatisticBreakdownItem[];
    tools: StatisticBreakdownItem[];
    features: StatisticBreakdownItem[];
  };
  availableFilters: {
    projectIds: string[];
    workspaceIds: string[];
    modelIds: string[];
    providerIds: string[];
    features: string[];
    categories: StatisticCategory[];
    results: string[];
  };
}

export interface StatisticsEventsResponse {
  items: StatisticEventRecord[];
  nextCursor: string | null;
}

export interface StatisticsResetResponse {
  deleted: number;
}
