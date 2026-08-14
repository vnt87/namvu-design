import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getStatisticsDashboard,
  insertStatisticEvents,
  listStatisticEvents,
  migrateStatistics,
  resetStatistics,
} from '../src/statistics/persistence.js';

describe('local statistics persistence', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(':memory:');
    migrateStatistics(db);
  });

  afterEach(() => db.close());

  it('stores only bounded semantic fields and aggregates dashboard data', () => {
    const now = Date.now();
    const result = insertStatisticEvents(db, [
      {
        id: 'run-1', occurredAt: now, name: 'run_finished', category: 'run', source: 'daemon',
        projectId: 'project-a', modelId: 'gpt-5', providerId: 'openai', feature: 'chat',
        result: 'succeeded', durationMs: 12_000, inputTokens: 80, outputTokens: 20,
        totalTokens: 100, toolNames: ['read', 'write'],
      },
      {
        id: 'artifact-1', occurredAt: now - 1, name: 'artifact_created', category: 'artifact',
        source: 'web', projectId: 'project-a', feature: 'prototype', result: 'success',
      },
    ]);

    expect(result).toEqual({ accepted: 2, ignored: 0 });
    const dashboard = getStatisticsDashboard(db, { range: 'all' });
    expect(dashboard.summary).toMatchObject({
      events: 2, runs: 1, succeeded: 1, totalTokens: 100, durationMs: 12_000, artifacts: 1,
    });
    expect(dashboard.breakdowns.models[0]).toMatchObject({ key: 'gpt-5', count: 1 });
    expect(dashboard.breakdowns.tools.map((item) => item.key)).toEqual(['read', 'write']);
    expect(dashboard.availableFilters.projectIds).toEqual(['project-a']);
  });

  it('deduplicates ids, filters events, paginates, and clears explicitly', () => {
    const now = Date.now();
    const events = [
      { id: 'a', occurredAt: now, name: 'run_finished', category: 'run', source: 'daemon', projectId: 'one', result: 'failed' },
      { id: 'b', occurredAt: now, name: 'run_finished', category: 'run', source: 'daemon', projectId: 'two', result: 'succeeded' },
    ];
    expect(insertStatisticEvents(db, [...events, events[0]]).accepted).toBe(2);
    expect(getStatisticsDashboard(db, { range: 'all', projectId: 'one' }).summary.failed).toBe(1);
    const page = listStatisticEvents(db, { range: 'all' }, null, 1);
    expect(page.items).toHaveLength(1);
    expect(page.nextCursor).not.toBeNull();
    const nextPage = listStatisticEvents(db, { range: 'all' }, page.nextCursor, 1);
    expect(nextPage.items).toHaveLength(1);
    expect(nextPage.items[0]?.id).not.toBe(page.items[0]?.id);
    expect(resetStatistics(db)).toBe(2);
    expect(getStatisticsDashboard(db, { range: 'all' }).summary.events).toBe(0);
  });

  it('rejects arbitrary text and malformed events', () => {
    const result = insertStatisticEvents(db, [
      { id: 'bad', occurredAt: Date.now(), name: 'contains a secret?', category: 'feature', source: 'web' },
      { id: 'missing-fields' },
    ]);
    expect(result).toEqual({ accepted: 0, ignored: 2 });
  });
});
