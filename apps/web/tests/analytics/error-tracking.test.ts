// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearExceptionTrackingContext,
  installErrorHandlers,
  patchExceptionTrackingAppVersion,
  reportHandledException,
  reportSafetyEvent,
  setExceptionTrackingContext,
} from '../../src/analytics/error-tracking';

describe('disabled remote error tracking', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('never performs an outbound request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    setExceptionTrackingContext({
      apiKey: 'legacy-key',
      host: 'https://telemetry.example.invalid',
      distinctId: 'legacy-id',
    });
    installErrorHandlers();
    patchExceptionTrackingAppVersion('1.0.0');
    reportHandledException(new Error('private error'));
    reportSafetyEvent('legacy_event', { content: 'private content' });
    clearExceptionTrackingContext();
    await Promise.resolve();

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
