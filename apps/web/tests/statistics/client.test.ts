// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { flushLocalStatistics, recordLocalStatistic } from '../../src/statistics/client';

describe('local statistics client', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('writes bounded semantic fields only to the local statistics endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    recordLocalStatistic('run_finished', {
      project_id: 'project-1',
      model_id: 'gpt-5',
      result: 'succeeded',
      total_tokens: 42,
      prompt: 'this must never be persisted',
    });
    await flushLocalStatistics();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/statistics/events');
    const body = JSON.parse(String(init.body)) as { events: Array<Record<string, unknown>> };
    expect(body.events[0]).toMatchObject({
      name: 'run_finished',
      category: 'run',
      source: 'web',
      projectId: 'project-1',
      modelId: 'gpt-5',
      result: 'succeeded',
      totalTokens: 42,
    });
    expect(JSON.stringify(body)).not.toContain('this must never be persisted');
  });
});
