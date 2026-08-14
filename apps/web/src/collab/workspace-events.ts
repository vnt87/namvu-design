import type { WorkspaceCollabContext, WorkspaceInvalidationSsePayload } from '@open-design/contracts';

export function workspaceEventsUrl(_context?: WorkspaceCollabContext | null): string {
  return '';
}
export type WorkspaceInvalidationHandlers = Record<string, unknown>;
export interface UseWorkspaceInvalidationOptions {
  context?: WorkspaceCollabContext | null;
  onEvent?: (event: WorkspaceInvalidationSsePayload) => void;
}
export function useWorkspaceInvalidation(
  _events: Record<string, (payload: any) => any>,
  _options?: any,
): any;
export function useWorkspaceInvalidation(_events?: any, _options?: any): any { return undefined; }
