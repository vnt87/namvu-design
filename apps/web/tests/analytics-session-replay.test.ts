// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

import {
  getAnalyticsClient,
  setAnalyticsPersonProperties,
  setAnalyticsUserId,
} from '../src/analytics/client';

describe('session replay removal', () => {
  it('does not initialize replay, identify a person, or perform network I/O', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    setAnalyticsUserId('legacy-user');
    setAnalyticsPersonProperties({ private: 'value' });
    const client = await getAnalyticsClient({
      anonymousId: 'legacy-id',
      sessionId: 'legacy-session',
      clientType: 'web',
      locale: 'en',
      appVersion: '1.0.0',
    });

    expect(client).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });
});
