import { useMemo } from 'react';
import type { WorkspaceCollabContext } from '@open-design/contracts';

export type TeamMembersState = any;

export function currentUserDirectoryEntry(..._args: any[]): any { return null; }
export function useTeamMembers(..._args: any[]): any {
  return useMemo(() => ({ members: [], loading: false, error: null, refresh: async () => undefined, resolve: () => null }), []);
}
