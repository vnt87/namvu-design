import type { ReactNode } from 'react';
import type { VelaLoginStatus } from '../providers/daemon';

/**
 * AMR login was removed with single-tenant mode. Keep this compatibility
 * export until the remaining settings/chat prop surfaces are retired.
 */
export type AmrAccountControlStatus = string;
export interface AmrAccountControlProps { [key: string]: any }
export interface AmrLoginPillProps {
  [key: string]: any;
  onStatusChange?: (status: VelaLoginStatus | null) => void;
}
export function closeAmrActivationWindowBestEffort(): boolean { return false; }
export function AmrAccountControl(_props: AmrAccountControlProps): ReactNode { return null; }
export function AmrLoginPill(_props: AmrLoginPillProps = {}): ReactNode { return null; }
