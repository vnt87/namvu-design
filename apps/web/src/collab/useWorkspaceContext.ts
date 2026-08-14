import { useMemo } from 'react';
import type {
  WorkspaceBillingResponse,
  WorkspaceBillingSnapshot,
  WorkspaceBillingSummary,
  WorkspaceCollabContext,
  WorkspaceDirectoryItem,
  WorkspaceInvalidationSsePayload,
  TeamProject,
} from '@open-design/contracts';

export type WorkspaceScopedRead<T = any> = any;

/** Single-tenant compatibility surface. Workspace/cloud state is intentionally absent. */
export type WorkspaceContextState = any;

export type WorkspaceBillingScopeInput = any;

export type CurrentWorkspaceContextReadWitness = any;

export interface TeamProjectsState {
  projects: TeamProject[];
  loading: boolean;
  error: unknown;
  refresh: (...args: any[]) => Promise<void>;
}

export function useWorkspaceContext(..._args: any[]): any {
  return useMemo(() => ({ context: null, loading: false, failure: 'unsupported' }), []);
}

export function workspaceResourceReadContext(state: any): any {
  return state.resourceReadIdentity ?? state.context ?? null;
}

export function workspaceIdentityCanBillAmr(..._args: any[]): any {
  return true;
}

export function workspaceIdentityCacheKey(..._args: any[]): any {
  return 'none';
}

export function beginWorkspaceScopedRead<T>(..._args: any[]): any {
  const context = _args[0] as T;
  return { context, isStillCurrent: (_current: T) => true };
}

export function currentWorkspaceContextRequestToken(): string { return 'single-tenant'; }
export function currentWorkspaceAccountGeneration(): number { return 0; }
export function workspaceContextRefreshHasVerifiedSelection(): boolean { return false; }
export function notifyWorkspaceContextRefresh(..._args: any[]): void {}
export function resetWorkspaceContextCache(): void {}
export function resetTeamProjectsCache(): void {}
export function lastResolvedWorkspaceContext(..._args: any[]): any { return null; }
export function lastResolvedTeamProjects(..._args: any[]): any { return []; }
export function workspaceContextFromDirectoryItem(_item: WorkspaceDirectoryItem): WorkspaceCollabContext {
  return {} as WorkspaceCollabContext;
}
export function readWorkspaceDirectoryForCurrentGeneration(): Promise<never[]> { return Promise.resolve([]); }
export function workspaceContextReadWitnessFromState(state: any): any {
  return { context: state.context, identityKey: 'none', accountGeneration: 0 };
}
export function resolveBoundProjectWorkspaceContext(..._args: any[]): any { return null; }
export function resolveCurrentWorkspaceContextReadWitness(): CurrentWorkspaceContextReadWitness {
  return { context: null, identityKey: 'none', accountGeneration: 0 };
}

export function useWorkspaceBillingResponse(..._args: any[]): any { return null; }
export function useWorkspaceBilling(..._args: any[]): any { return null; }
export function workspaceBillingSummaryForContext(
  _response: WorkspaceBillingResponse | null,
  _context: WorkspaceCollabContext | null,
): any { return null; }
export function workspaceBillingBalanceUsd(
  _response: WorkspaceBillingResponse | null,
  _context: WorkspaceCollabContext | null,
): any { return null; }
export function workspaceBillingSnapshotForContext(
  _response: WorkspaceBillingResponse | null,
  _context: WorkspaceCollabContext | null,
): any { return null; }
export function resetWorkspaceBillingCache(): void {}
export function shouldRefreshWorkspaceBilling(..._args: any[]): boolean { return false; }
export function notifyWorkspaceBillingRefresh(..._args: any[]): void {}
export function notifyTeamProjectsChanged(_payload?: unknown): void {}
export function useTeamProjects(..._args: any[]): TeamProjectsState {
  return useMemo(() => ({ projects: [], loading: false, error: null, refresh: async () => undefined }), []);
}

export type { WorkspaceCollabContext, WorkspaceInvalidationSsePayload, TeamProject };
export const WORKSPACE_CONTEXT_REFRESH_EVENT = 'workspace-context-refresh';
export const TEAM_PROJECTS_CHANGED_EVENT = 'team-projects-changed';
export const WORKSPACE_BILLING_REFRESH_EVENT = 'workspace-billing-refresh';
export function __setWorkspaceContextRetryBackoffForTests(..._args: any[]): void {}
