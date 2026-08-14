import { describe, expect, it } from 'vitest';

import { resolveEntryRailAccountFooterState } from '../../src/components/entry-rail-account-state';

describe('resolveEntryRailAccountFooterState', () => {
  it('always hides the account footer in single-tenant mode', () => {
    expect(resolveEntryRailAccountFooterState()).toBe('hidden');
  });
});
