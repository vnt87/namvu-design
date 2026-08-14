// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { StatisticsSection } from '../../src/components/StatisticsSection';
import { I18nProvider } from '../../src/i18n';

const emptyDashboard = {
  generatedAt: Date.now(),
  filters: { range: '30d' },
  summary: {
    events: 0, runs: 0, succeeded: 0, failed: 0, canceled: 0,
    successRate: null, totalTokens: 0, inputTokens: 0, outputTokens: 0,
    durationMs: 0, artifacts: 0, featuresUsed: 0,
  },
  timeline: [],
  breakdowns: { results: [], models: [], providers: [], tools: [], features: [] },
  availableFilters: {
    projectIds: [], workspaceIds: [], modelIds: [], providerIds: [],
    features: [], categories: [], results: [],
  },
};

describe('StatisticsSection', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('loads local data and explains that it never leaves the device', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const body = url.includes('/events') ? { items: [], nextCursor: null } : emptyDashboard;
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <I18nProvider initial="en">
        <StatisticsSection />
      </I18nProvider>,
    );

    expect(screen.getByText('Local only')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('No statistics yet')).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/^\/api\/statistics\?/));
  });
});
