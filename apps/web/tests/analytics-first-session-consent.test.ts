// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

import { getAnalyticsClient } from '../src/analytics/client';

describe('removed remote analytics client', () => {
  it('never initializes a client or reads remote analytics config', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const client = await getAnalyticsClient({
      anonymousId: 'legacy-id',
      sessionId: 'legacy-session',
      clientType: 'web',
      locale: 'en',
      appVersion: '1.0.0',
    });

    expect(client).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('open-design:analytics.first_session_id')).toBeNull();
    fetchMock.mockRestore();
  });
});
