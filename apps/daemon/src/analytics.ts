import crypto from 'node:crypto';
import type { Request } from 'express';
import {
  ANALYTICS_HEADER_ATTRIBUTION_QUALITY,
  ANALYTICS_HEADER_CLIENT_TYPE,
  ANALYTICS_HEADER_DEVICE_ID,
  ANALYTICS_HEADER_DISTRIBUTION_MECHANISM,
  ANALYTICS_HEADER_ENTRY_SURFACE,
  ANALYTICS_HEADER_EXTERNAL_PLUGIN_ID,
  ANALYTICS_HEADER_EXTERNAL_PLUGIN_VERSION,
  ANALYTICS_HEADER_HOST_PRODUCT,
  ANALYTICS_HEADER_LOCALE,
  ANALYTICS_HEADER_MCP_SESSION_ID,
  ANALYTICS_HEADER_PUBLISHER_CLASS,
  ANALYTICS_HEADER_REQUEST_ID,
  ANALYTICS_HEADER_SESSION_ID,
  anonymizeArtifactId as anonymizeArtifactIdShared,
  type AnalyticsAttributionQuality,
  type AnalyticsClientType,
  type AnalyticsConfigResponse,
  type AnalyticsDistributionMechanism,
  type AnalyticsEntrySurface,
  type AnalyticsHostProduct,
  type AnalyticsPublisherClass,
} from '@open-design/contracts/analytics';
import { readTelemetryEnvironment } from './telemetry-environment.js';

export interface AnalyticsContext {
  deviceId: string;
  sessionId: string;
  clientType: AnalyticsClientType;
  locale: string;
  requestId: string | null;
  entrySurface?: AnalyticsEntrySurface;
  hostProduct?: AnalyticsHostProduct;
  externalPluginId?: string;
  externalPluginVersion?: string;
  distributionMechanism?: AnalyticsDistributionMechanism;
  publisherClass?: AnalyticsPublisherClass;
  attributionQuality?: AnalyticsAttributionQuality;
  mcpSessionId?: string;
}

export function readAnalyticsContext(req: Request): AnalyticsContext | null {
  // Context now exists only to route existing semantic event call sites into
  // the local statistics adapter. Stable person identity is deliberately not
  // collected; requests without legacy headers share an inert local token.
  const deviceId = headerString(req, ANALYTICS_HEADER_DEVICE_ID) ?? 'local';
  const clientHeader = headerString(req, ANALYTICS_HEADER_CLIENT_TYPE);
  const clientType: AnalyticsClientType = clientHeader === 'desktop'
    ? 'desktop'
    : clientHeader === 'external_mcp'
      ? 'external_mcp'
      : 'web';
  const optional = {
    entrySurface: boundedHeader(req, ANALYTICS_HEADER_ENTRY_SURFACE, ['open_design_ui', 'od_cli', 'external_mcp'] as const),
    hostProduct: boundedHeader(req, ANALYTICS_HEADER_HOST_PRODUCT, ['codex_desktop', 'codex_cli', 'codex_unknown', 'claude_code', 'unknown'] as const),
    distributionMechanism: boundedHeader(req, ANALYTICS_HEADER_DISTRIBUTION_MECHANISM, ['git_marketplace', 'local_repo', 'manual', 'unknown'] as const),
    publisherClass: boundedHeader(req, ANALYTICS_HEADER_PUBLISHER_CLASS, ['open_design_first_party', 'third_party', 'unknown'] as const),
    attributionQuality: boundedHeader(req, ANALYTICS_HEADER_ATTRIBUTION_QUALITY, ['self_reported', 'session_correlated'] as const),
    externalPluginId: boundedFreeTextHeader(req, ANALYTICS_HEADER_EXTERNAL_PLUGIN_ID),
    externalPluginVersion: boundedFreeTextHeader(req, ANALYTICS_HEADER_EXTERNAL_PLUGIN_VERSION),
    mcpSessionId: boundedFreeTextHeader(req, ANALYTICS_HEADER_MCP_SESSION_ID),
  };
  return {
    deviceId,
    sessionId: headerString(req, ANALYTICS_HEADER_SESSION_ID) ?? deviceId,
    clientType,
    locale: headerString(req, ANALYTICS_HEADER_LOCALE) ?? 'en',
    requestId: headerString(req, ANALYTICS_HEADER_REQUEST_ID),
    ...Object.fromEntries(Object.entries(optional).filter(([, value]) => value !== undefined)),
  } as AnalyticsContext;
}

function headerString(req: Request, name: string): string | null {
  const raw = req.headers[name];
  if (Array.isArray(raw)) return raw[0]?.trim() || null;
  return typeof raw === 'string' ? raw.trim() || null : null;
}

function boundedHeader<const Values extends readonly string[]>(
  req: Request,
  name: string,
  values: Values,
): Values[number] | undefined {
  const value = headerString(req, name);
  return value && values.includes(value) ? value : undefined;
}

function boundedFreeTextHeader(req: Request, name: string): string | undefined {
  const value = headerString(req, name);
  return value && value.length <= 128 && /^[A-Za-z0-9._:@/-]+$/u.test(value)
    ? value
    : undefined;
}

/** Legacy shape retained for callers; no runtime can produce a config. */
export interface PosthogConfig { key: string; host: string; env: string }
export function readPosthogConfig(_env: NodeJS.ProcessEnv = process.env): null { return null; }
export function readPublicConfigResponse(env: NodeJS.ProcessEnv = process.env): AnalyticsConfigResponse {
  return { enabled: false, env: readTelemetryEnvironment(env), key: null, host: null };
}

export interface AnalyticsService {
  capture(args: { eventName: string; context: AnalyticsContext; appVersion: string; properties: Record<string, unknown>; insertId: string }): Promise<void>;
  captureSafety(args: { eventName: string; distinctId?: string; appVersion: string; properties: Record<string, unknown>; insertId?: string }): Promise<void>;
  mergeAnonymousPerson(args: { anonymousDistinctId: string; distinctId: string; properties?: Record<string, unknown>; insertId?: string }): Promise<void>;
  identifyGroup(args: { context: AnalyticsContext; groupType: 'workspace'; groupKey: string; properties: Record<string, unknown> }): Promise<void>;
  shutdown(): Promise<void>;
}

const NOOP_SERVICE: AnalyticsService = {
  capture: async () => undefined,
  captureSafety: async () => undefined,
  mergeAnonymousPerson: async () => undefined,
  identifyGroup: async () => undefined,
  shutdown: async () => undefined,
};

export function createAnalyticsService(_args: { env?: NodeJS.ProcessEnv; dataDir: string }): AnalyticsService {
  return NOOP_SERVICE;
}

export const anonymizeArtifactId = anonymizeArtifactIdShared;
export function newInsertId(): string { return crypto.randomUUID(); }
