const disabledMetric = {
  inc: (..._args: unknown[]): void => undefined,
  observe: (..._args: unknown[]): void => undefined,
  set: (..._args: unknown[]): void => undefined,
  reset: (): void => undefined,
};

// Compatibility shims for critique call sites. Metrics are not collected or exposed.
export const critiqueRunsTotal = disabledMetric;
export const critiqueRoundsTotal = disabledMetric;
export const critiqueRoundDurationMs = disabledMetric;
export const critiqueCompositeScore = disabledMetric;
export const critiqueMustFixTotal = disabledMetric;
export const critiqueDegradedTotal = disabledMetric;
export const critiqueInterruptedTotal = disabledMetric;
export const critiqueParserErrorsTotal = disabledMetric;
export const critiqueProtocolVersion = disabledMetric;
export async function getCritiqueMetrics(): Promise<string> { return ''; }
export const register = {
  contentType: 'text/plain',
  metrics: async (): Promise<string> => '',
  clear: (): void => undefined,
  getMetricsAsArray: (): unknown[] => [],
};
export function __resetCritiqueMetricsForTests(): void {}
export * from './workspace-authority.js';
