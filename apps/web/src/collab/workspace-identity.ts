import type { WorkspaceCollabContext } from '@open-design/contracts';

export function workspaceProjectHeaders(..._args: any[]): any {
  return {};
}

export function workspaceResourceUrl(..._args: any[]): any {
  return typeof _args[0] === 'string' ? _args[0] : '';
}

export function appendResourceQuery(path: string, query?: string, ..._args: any[]): any {
  return query ? `${path}${path.includes('?') ? '&' : '?'}${query}` : path;
}

export function workspaceIdentityCacheKey(..._args: any[]): any {
  return 'none';
}

export type WorkspaceResourceReadIdentity = any;

export function resolveWorkspaceResourceReadIdentity(..._args: any[]): any {
  return { context: null, generation: 0, identityKey: 'none' };
}

export function workspaceResourceReadIdentityFromContext(..._args: any[]): any {
  const context = _args[0] as WorkspaceCollabContext | null;
  return { context, generation: 0, identityKey: 'none' };
}

export function workspaceResourceReadIdentityKey(..._args: any[]): any { return 'none'; }

export type WorkspaceResourceScopedRead<T = any> = any;

export function beginWorkspaceResourceScopedRead<T>(..._args: any[]): any {
  const context = _args[0] as T;
  return { context, isStillCurrent: (_current: T) => true };
}

export type WorkspaceScopedRead<T = any> = any;

export function beginWorkspaceScopedRead<T>(..._args: any[]): any {
  const context = _args[0] as T;
  return { context, isStillCurrent: (_current: T) => true };
}
