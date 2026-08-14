import { describe, expect, it } from 'vitest';
import { en } from '../../src/i18n/locales/en';
import { vi } from '../../src/i18n/locales/vi';

describe('Design Files agent copy', () => {
  it('uses neutral agent wording in supported locales', () => {
    for (const [locale, dict] of Object.entries({ en, vi })) {
      expect(dict['designFiles.dropDesc'], locale).not.toMatch(/claude/i);
    }
  });
});
