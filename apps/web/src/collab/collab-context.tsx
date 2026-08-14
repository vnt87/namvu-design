import type { ReactNode } from 'react';

export type ProjectResourceAuthority = 'pending' | 'denied' | 'local' | 'workspace';
export type CollabContextValue = any;

export function CollabProvider({ children }: { value?: any; children: ReactNode }): ReactNode {
  return children;
}

export function useProjectCollabContext(): any {
  return {
    authority: 'local' as ProjectResourceAuthority,
    resourceAuthority: 'local' as ProjectResourceAuthority,
    workspaceContext: null,
    context: null,
    isConnected: false,
    connected: false,
    loading: false,
    error: null,
    presence: [],
    members: [],
    comments: [],
    publish: async () => undefined,
    refresh: async () => undefined,
  };
}
