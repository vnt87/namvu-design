export interface ExceptionTrackingContext {
  apiKey?: string;
  host?: string;
  distinctId?: string;
  appVersion?: string;
  sessionId?: string;
  telemetryEnv?: string;
}

/** Remote exception and safety reporting is intentionally disabled. */
export function setExceptionTrackingContext(_next: ExceptionTrackingContext): void {}
export function clearExceptionTrackingContext(): void {}
export function patchExceptionTrackingAppVersion(_version: string): void {}
export function installErrorHandlers(): void {}
export function reportHandledException(_error: unknown, _message?: string): void {}
export function reportSafetyEvent(
  _event: string,
  _properties: Record<string, unknown> = {},
): void {}
