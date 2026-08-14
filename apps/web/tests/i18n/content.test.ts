import { describe, expect, it } from 'vitest';
import type { SkillSummary } from '../../src/types';
import {
  hasLocalizedContent,
  localizeSkillDescription,
  localizeSkillPrompt,
} from '../../src/i18n/content';

describe('localized resource content', () => {
  it('uses source English resource content for both supported UI locales', () => {
    const skill = {
      description: ' English description from source. ',
      examplePrompt: ' English prompt from source. ',
    } as SkillSummary;

    expect(localizeSkillDescription('en', skill)).toBe('English description from source.');
    expect(localizeSkillPrompt('vi', skill)).toBe('English prompt from source.');
  });

  it('marks Vietnamese resource fallback as intentional', () => {
    expect(hasLocalizedContent('vi')).toBe(true);
    expect(hasLocalizedContent('en')).toBe(false);
  });
});
