import type { WorkspaceCollabContext } from '@open-design/contracts';

export type ProjectRouteWorkspaceContextState = any;

export function projectResourceReadsCanStart(..._args: any[]): any { return true; }

export function useProjectRouteWorkspaceContext(..._args: any[]): any {
  return { context: null as WorkspaceCollabContext | null, loading: false, retry: () => undefined };
}
