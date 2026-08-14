import { describe, expect, it } from 'vitest';
import { resolveSystemLocale } from '../../src/i18n';
import { en } from '../../src/i18n/locales/en';
import { vi } from '../../src/i18n/locales/vi';
import { LOCALES, LOCALE_LABEL, type Dict } from '../../src/i18n/types';

function placeholders(value: string): string[] {
  return Array.from(value.matchAll(/\{(\w+)\}/g), (match) => match[1] ?? '').sort();
}

describe('i18n locales', () => {
  it('supports only English and Vietnamese in the language menu', () => {
    expect(LOCALES).toEqual(['en', 'vi']);
    expect(LOCALE_LABEL.en).toBe('English');
    expect(LOCALE_LABEL.vi).toBe('Tiếng Việt');
  });

  it('resolves Vietnamese and falls back to English for unsupported languages', () => {
    expect(resolveSystemLocale(['vi-VN', 'en-US'])).toBe('vi');
    expect(resolveSystemLocale(['vi'])).toBe('vi');
    expect(resolveSystemLocale(['zh-CN', 'en-US'])).toBe('en');
    expect(resolveSystemLocale(['nl-NL'])).toBeNull();
  });

  it('keeps English and Vietnamese dictionaries aligned', () => {
    const englishKeys = Object.keys(en).sort();
    expect(Object.keys(vi).sort()).toEqual(englishKeys);
    for (const key of englishKeys as Array<keyof Dict>) {
      expect(placeholders(vi[key]), `vi.${key}`).toEqual(placeholders(en[key]));
    }
  });
});
