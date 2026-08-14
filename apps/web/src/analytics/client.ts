import type { AnalyticsConfigureGlobals } from '@open-design/contracts/analytics';

interface AnalyticsContext {
  anonymousId: string;
  sessionId: string;
  clientType: string;
  locale: string;
  appVersion: string;
  isFirstSession?: boolean;
}

let configureGlobals: AnalyticsConfigureGlobals = {
  has_available_configure_cli: false,
  configure_type: 'unknown',
  configure_availability: 'unknown',
  runtime_type: 'none',
  cli_runnable: false,
  byok_runnable: false,
  amr_runnable: false,
};

/** Remote analytics has been removed; these shims keep non-telemetry callers source compatible. */
export function getResolvedAnonymousId(): null { return null; }
export function getResolvedDeviceId(): null { return null; }
export function getConfigureGlobals(): AnalyticsConfigureGlobals { return configureGlobals; }
export function setConfigureGlobals(next: AnalyticsConfigureGlobals): void { configureGlobals = { ...next }; }
export function setAnalyticsUserId(_userId: string | null): void {}
export function setAnalyticsPersonProperties(_properties: Record<string, unknown>): void {}
export function bootstrapExceptionTracking(_context: AnalyticsContext): Promise<void> { return Promise.resolve(); }
export async function getAnalyticsClient(_context: AnalyticsContext): Promise<null> { return null; }
export function applyConsent(_consentGranted: boolean): void {}
export function applyIdentity(_installationId: string | null): void {}
export function capture(
  _client: null,
  _args: { event: string; properties: Record<string, unknown>; insertId: string; requestId?: string | null },
): void {}
