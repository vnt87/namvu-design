import { describe, expect, it } from 'vitest';
import { en } from '../../src/i18n/locales/en';
import { vi } from '../../src/i18n/locales/vi';

describe('Design Files dropzone copy', () => {
  it('does not advertise unsupported Figma link drops', () => {
    for (const [locale, dict] of Object.entries({ en, vi })) {
      expect(dict['designFiles.dropDesc'], locale).not.toMatch(/figma/i);
    }
  });
});
