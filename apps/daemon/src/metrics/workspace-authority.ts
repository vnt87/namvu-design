import type { WorkspaceAuthorityCacheMode } from '../collab/workspace-authority-health.js';

export type WorkspaceAuthorityMetricSource = 'cache' | 'directory' | 'current' | 'billing' | 'sse';
export type WorkspaceAuthorityMetricReason = 'cold' | 'lease_hit' | 'lease_expired' | 'in_flight' | 'fresh' | 'mutation' | 'event_dirty' | 'auth_reject' | 'catch_up' | 'safety_floor' | 'mode_disabled' | 'capability_missing' | 'source_gap' | 'unhealthy' | 'healthy';
export type WorkspaceAuthorityMetricOutcome = 'allow' | 'deny' | 'unavailable' | 'fallback';

const disabledMetric = { inc: (..._args: unknown[]): void => undefined, observe: (..._args: unknown[]): void => undefined, reset: (): void => undefined };
export const workspaceAuthorityDecisionsTotal = disabledMetric;
export const workspaceAuthoritySuppressedRequestsTotal = disabledMetric;
export const workspaceAuthorityInvalidationsTotal = disabledMetric;
export const workspaceAuthorityRealtimeTransitionsTotal = disabledMetric;
export const workspaceAuthorityAgeMs = disabledMetric;
export const workspaceAuthorityRevocationClearMs = disabledMetric;

export function recordWorkspaceAuthorityDecision(_input: { mode: WorkspaceAuthorityCacheMode; source: WorkspaceAuthorityMetricSource; reason: WorkspaceAuthorityMetricReason; outcome: WorkspaceAuthorityMetricOutcome; ageMs?: number }): void {}
export function recordWorkspaceAuthoritySuppressedRequest(_input: { mode: WorkspaceAuthorityCacheMode; source: WorkspaceAuthorityMetricSource; reason: 'lease_hit' | 'in_flight' | 'safety_floor' }): void {}
export function recordWorkspaceAuthorityInvalidation(_input: { mode: WorkspaceAuthorityCacheMode; source: 'cache' | 'current'; reason: 'mutation' | 'event_dirty' | 'auth_reject' | 'catch_up' | 'unhealthy' }): void {}
export function recordWorkspaceAuthorityRealtimeTransition(_input: { mode: WorkspaceAuthorityCacheMode; healthy: boolean; memberEvents: boolean; listenerStatus: boolean; sourceGap: boolean }): void {}
export function recordWorkspaceAuthorityRevocationClear(_mode: WorkspaceAuthorityCacheMode, _durationMs: number): void {}
export function __resetWorkspaceAuthorityMetricsForTests(): void {}
