import { useMemo } from 'react';
import type { WorkspaceCollabContext, ProjectWorkspaceScope, TeamProject } from '@open-design/contracts';
import { useWorkspaceContext } from './useWorkspaceContext';

export type ProjectWorkspaceScopeState = any;

export function projectWorkspaceContext(_scope?: ProjectWorkspaceScope | null): any { return null; }
export function projectWorkspaceScopeReady(..._args: any[]): any { return true; }
export function runWorkspacePersonalAdoptionWitness(..._args: any[]): any { return null; }
export function runWorkspaceIdentity(..._args: any[]): any { return null; }
export function projectWorkspaceScopeAuthorizesAmr(..._args: any[]): any { return true; }
export function resolveProjectWorkspaceContext(..._args: any[]): any { return null; }

export function useProjectWorkspaceScope(_projectId?: string | null, ..._args: any[]): any {
  const state = useWorkspaceContext();
  return useMemo(() => ({
    scope: null,
    context: state.context,
    loading: false,
    failure: null,
    retry: () => undefined,
    workspaceId: null,
    isTeamShared: false,
  }), [state.context]);
}
