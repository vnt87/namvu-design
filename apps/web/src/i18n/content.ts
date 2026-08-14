import type { DesignSystemSummary, PromptTemplateSummary, SkillSummary } from '../types';
import type { Locale } from './types';

type LocalizedContentIds = {
  skills: string[];
  designSystems: string[];
  designSystemCategories: string[];
  promptTemplates: string[];
  promptTemplateCategories: string[];
  promptTemplateTags: string[];
};

const EMPTY_CONTENT_IDS: LocalizedContentIds = {
  skills: [],
  designSystems: [],
  designSystemCategories: [],
  promptTemplates: [],
  promptTemplateCategories: [],
  promptTemplateTags: [],
};

// Built-in resource copy is currently authored in English. UI strings still
// use the typed Vietnamese dictionary, while resource metadata falls back to
// the source English values until a Vietnamese content bundle is authored.
export const LOCALIZED_CONTENT_IDS = { vi: EMPTY_CONTENT_IDS };
export const GERMAN_CONTENT_IDS = EMPTY_CONTENT_IDS;
export const RUSSIAN_CONTENT_IDS = EMPTY_CONTENT_IDS;
export const FRENCH_CONTENT_IDS = EMPTY_CONTENT_IDS;

export function hasLocalizedContent(locale: Locale): boolean {
  return locale === 'vi';
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function localizedRecordValue(
  locale: Locale,
  values: Record<string, string> | undefined,
): string | undefined {
  return values?.[locale] ?? values?.en;
}

export function localizeSkillName(locale: Locale, skill: SkillSummary): string {
  return localizedRecordValue(locale, skill.displayName) ?? skill.name;
}

export function localizeSkillPrompt(locale: Locale, skill: SkillSummary): string | undefined {
  return localizedRecordValue(locale, skill.examplePromptI18n)
    ?? (skill.examplePrompt ? normalizeText(skill.examplePrompt) : undefined);
}

export function localizeSkillDescription(locale: Locale, skill: SkillSummary): string {
  return localizedRecordValue(locale, skill.descriptionI18n) ?? normalizeText(skill.description);
}

export function localizeDesignSystemSummary(
  _locale: Locale,
  system: DesignSystemSummary,
): string {
  return system.summary || system.category || '';
}

export function localizeDesignSystemCategory(_locale: Locale, category: string): string {
  return category;
}

export function localizePromptTemplateCategory(_locale: Locale, category: string): string {
  return category;
}

export function localizePromptTemplateSummary(
  _locale: Locale,
  template: PromptTemplateSummary,
): PromptTemplateSummary {
  return template;
}
