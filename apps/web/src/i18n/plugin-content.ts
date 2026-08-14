import type { InputFieldSpec } from '@open-design/contracts';
import type { Locale } from './types';

type PluginChromeKey =
  | 'about' | 'applying' | 'assets' | 'atoms' | 'author' | 'by' | 'capabilities'
  | 'capabilitiesHint' | 'claudePlugins' | 'closeDetails' | 'closeEsc' | 'connectors'
  | 'contextBundles' | 'contextBundlesHint' | 'contribute' | 'copy' | 'copied' | 'craft'
  | 'defaultPrefix' | 'designSpecOnly' | 'designSystem' | 'details' | 'detailsAria'
  | 'developerDetails' | 'examplePrefix' | 'exampleQuery' | 'exampleQueryHint'
  | 'genuiSurfaces' | 'genuiSurfacesHint' | 'homepage' | 'image' | 'inputs' | 'inputsHint'
  | 'installed' | 'license' | 'marketplaceId' | 'mcpServers' | 'moreWaysTo'
  | 'onFailurePrefix' | 'openContributePage' | 'openIssueOnGithub' | 'optional' | 'origin'
  | 'path' | 'persistsAt' | 'pinnedRef' | 'pluginInfo' | 'primary' | 'repeat' | 'required'
  | 'source' | 'spec' | 'skills' | 'trust' | 'untilPrefix' | 'version' | 'video' | 'audio'
  | 'workflow' | 'workflowHint';

const EN_PLUGIN_CHROME: Record<PluginChromeKey, string> = {
  about: 'About', applying: 'Applying…', assets: 'Assets', atoms: 'Atoms', author: 'Author', by: 'by',
  capabilities: 'Capabilities', capabilitiesHint: 'Permissions the plugin requests when applied.',
  claudePlugins: 'Claude plugins', closeDetails: 'Close details', closeEsc: 'Close (Esc)', connectors: 'Connectors',
  contextBundles: 'Context bundles', contextBundlesHint: 'Skills, design systems, MCP servers and other refs the plugin will pull in at apply time.',
  contribute: 'Contribute', copy: 'Copy', copied: 'Copied', craft: 'Craft', defaultPrefix: 'default:',
  designSpecOnly: 'This plugin ships only the design spec — open Plugin info to read DESIGN.md.',
  designSystem: 'Design system', details: 'details', detailsAria: '{title} details', developerDetails: 'Developer details',
  examplePrefix: 'e.g.', exampleQuery: 'Example query', exampleQueryHint: 'Inserted into the prompt textarea when you apply this plugin.',
  genuiSurfaces: 'GenUI surfaces', genuiSurfacesHint: 'Interactive prompts the plugin may surface during a run.', homepage: 'Homepage',
  image: 'Image', inputs: 'Inputs', inputsHint: 'Variables substituted into the example query at apply time.', installed: 'Installed',
  license: 'License', marketplaceId: 'Marketplace ID', mcpServers: 'MCP servers', moreWaysTo: 'More ways to {label}',
  onFailurePrefix: 'on failure:', openContributePage: 'Open the contribute page', openIssueOnGithub: 'Open an issue on GitHub',
  optional: 'Optional', origin: 'Origin', path: 'Path', persistsAt: 'persists at', pinnedRef: 'Pinned ref', pluginInfo: 'Plugin info',
  primary: 'primary', repeat: 'repeat', required: 'required', source: 'Source', spec: 'Spec', skills: 'Skills', trust: 'Trust',
  untilPrefix: 'until:', version: 'Version', video: 'Video', audio: 'Audio', workflow: 'Workflow',
  workflowHint: 'Pipeline stages run in order. Atoms inside a stage run sequentially unless the stage repeats.',
};

const VI_LABELS: Record<string, string> = {
  about: 'Giới thiệu', applying: 'Đang áp dụng…', assets: 'Tài sản', author: 'Tác giả', by: 'bởi',
  capabilities: 'Khả năng', closeDetails: 'Đóng chi tiết', copy: 'Sao chép', copied: 'Đã sao chép',
  contribute: 'Đóng góp', designSystem: 'Hệ thống thiết kế', details: 'chi tiết', developerDetails: 'Chi tiết nhà phát triển',
  exampleQuery: 'Truy vấn mẫu', homepage: 'Trang chủ', image: 'Hình ảnh', inputs: 'Đầu vào', installed: 'Đã cài đặt',
  license: 'Giấy phép', pluginInfo: 'Thông tin plugin', required: 'bắt buộc', source: 'Nguồn', version: 'Phiên bản',
  video: 'Video', audio: 'Âm thanh', workflow: 'Quy trình', optional: 'Tùy chọn',
};

export function localizePluginInputLabel(_locale: Locale, field: InputFieldSpec): string {
  return field.label ?? field.name;
}

export function localizePluginPlaceholder(_locale: Locale, value?: string, fallback = ''): string {
  return value ?? fallback;
}

export function localizePluginDisplayValue(_locale: Locale, value: unknown): string {
  return value == null ? '' : String(value);
}

export function localizePluginChrome(locale: Locale, key: PluginChromeKey, vars: Record<string, string | number> = {}): string {
  const phrase = locale === 'vi' ? VI_LABELS[key] ?? EN_PLUGIN_CHROME[key] : EN_PLUGIN_CHROME[key];
  return phrase.replace(/\{(\w+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match);
}
