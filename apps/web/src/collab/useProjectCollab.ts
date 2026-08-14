import type { WorkspaceCollabContext } from '@open-design/contracts';

export interface UseProjectCollabOptions {
  [key: string]: any;
}

export type ProjectCollab = any;

export function markProjectCreatedByViewer(..._args: any[]): void {}
export function resetProjectsCreatedByViewerCache(): void {}
export function useWorkspaceContext(..._args: any[]): any {
  return null;
}

export function resolveProjectWriterAuthority(..._args: any[]): any {
  return 'allowed';
}

export function useProjectCollab(
  _projectId: string | null | undefined,
  _options: UseProjectCollabOptions = {},
): any {
  return {
    enabled: false,
    member: null,
    present: [],
    publishedVersion: null,
    syncState: 'local_only',
    viewerOnly: false,
    writerAuthority: 'allowed',
    isOwner: true,
    isEffectiveOwner: true,
    isSharedNonOwner: false,
    ownerDisplayName: null,
    ownerRole: null,
    downloadPending: false,
    reportChange: () => undefined,
    requestPublish: () => undefined,
    refreshPresence: () => undefined,
    checkStatusNow: () => undefined,
  };
}
