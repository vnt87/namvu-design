'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AnalyticsConfigureGlobals } from '@open-design/contracts/analytics';
import { APP_VERSION_PLACEHOLDER } from './app-version';
import { getAnonymousId, getSessionId } from './identity';
import { randomUUID } from '../utils/uuid';
import { recordLocalStatistic } from '../statistics/client';

interface AnalyticsContextValue {
  track: (
    event: string,
    properties: Record<string, unknown>,
    options?: { requestId?: string; insertId?: string },
  ) => void;
  /** Compatibility no-ops retained while callers migrate away from telemetry preferences. */
  setConsent: (granted: boolean) => void;
  setIdentity: (installationId: string | null) => void;
  setConfigureGlobals: (next: AnalyticsConfigureGlobals) => void;
  setUserId: (userId: string | null) => void;
  anonymousId: string;
  sessionId: string;
  newRequestId: () => string;
}

const Ctx = createContext<AnalyticsContextValue | null>(null);
let runtimeAppVersion: string | null = null;
let runtimeAppVersionPromise: Promise<string | null> | null = null;

async function loadRuntimeAppVersion(): Promise<string | null> {
  if (runtimeAppVersion) return runtimeAppVersion;
  if (!runtimeAppVersionPromise) {
    runtimeAppVersionPromise = (async () => {
      try {
        const response = await fetch('/api/version');
        if (!response.ok) return null;
        const body = await response.json() as { version?: { version?: string } };
        runtimeAppVersion = body.version?.version ?? null;
        return runtimeAppVersion;
      } catch {
        return null;
      } finally {
        if (!runtimeAppVersion) runtimeAppVersionPromise = null;
      }
    })();
  }
  return runtimeAppVersionPromise;
}

export async function resolveAppVersionForCapture(current: string): Promise<string> {
  if (current && current !== APP_VERSION_PLACEHOLDER) return current;
  return (await loadRuntimeAppVersion()) ?? current;
}

export function useAppVersion(): string {
  const [version, setVersion] = useState(APP_VERSION_PLACEHOLDER);
  useEffect(() => {
    let active = true;
    void loadRuntimeAppVersion().then((next) => {
      if (active && next) setVersion(next);
    });
    return () => { active = false; };
  }, []);
  return version;
}

export function AnalyticsProvider({ children }: { children: ReactNode }): JSX.Element {
  const identity = useMemo(() => ({
    anonymousId: getAnonymousId(),
    sessionId: getSessionId(),
  }), []);
  const track = useCallback<AnalyticsContextValue['track']>((event, properties, options) => {
    recordLocalStatistic(event, properties, { id: options?.insertId ?? randomUUID() });
  }, []);
  const value = useMemo<AnalyticsContextValue>(() => ({
    track,
    setConsent: () => undefined,
    setIdentity: () => undefined,
    setConfigureGlobals: () => undefined,
    setUserId: () => undefined,
    anonymousId: identity.anonymousId,
    sessionId: identity.sessionId,
    newRequestId: () => randomUUID(),
  }), [identity, track]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAnalytics(): AnalyticsContextValue {
  return useContext(Ctx) ?? {
    track: () => undefined,
    setConsent: () => undefined,
    setIdentity: () => undefined,
    setConfigureGlobals: () => undefined,
    setUserId: () => undefined,
    anonymousId: 'unmounted',
    sessionId: 'unmounted',
    newRequestId: () => randomUUID(),
  };
}
