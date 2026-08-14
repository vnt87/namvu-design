# Rebrand: Open Design → NamVu Design

## Context

Replace every user-visible instance of "Open Design" and "OpenDesign" with "NamVu Design" across the entire app. Code identifiers (variable names, function names, TypeScript types, import paths, package scopes like `@open-design/*`) are NOT changed — only strings that appear in the UI, installer text, manifests, emails, and system prompts.

The substitution rule is straightforward:
- `"Open Design"` → `"NamVu Design"`
- `"OpenDesign"` (when used as a display name, not a code identifier) → `"NamVu Design"`
- `"Open Design Cloud"` → `"NamVu Design Cloud"`
- `"OpenDesign Team"` → `"NamVu Design Team"`

---

## A. i18n Locale Files (highest density — ~161 hits in en.ts alone)

All 19 locale files under `apps/web/src/i18n/locales/` contain "Open Design" in user-visible string values. The affected files are:

```
apps/web/src/i18n/locales/en.ts      ← primary source, ~161 hits
apps/web/src/i18n/locales/ar.ts
apps/web/src/i18n/locales/de.ts
apps/web/src/i18n/locales/es-ES.ts
apps/web/src/i18n/locales/fa.ts
apps/web/src/i18n/locales/fr.ts
apps/web/src/i18n/locales/hu.ts
apps/web/src/i18n/locales/id.ts
apps/web/src/i18n/locales/it.ts
apps/web/src/i18n/locales/ja.ts
apps/web/src/i18n/locales/ko.ts
apps/web/src/i18n/locales/pl.ts
apps/web/src/i18n/locales/pt-BR.ts
apps/web/src/i18n/locales/ru.ts
apps/web/src/i18n/locales/th.ts
apps/web/src/i18n/locales/tr.ts
apps/web/src/i18n/locales/uk.ts
apps/web/src/i18n/locales/zh-CN.ts
apps/web/src/i18n/locales/zh-TW.ts
```

**Execution:** Run a sed replace on all 19 files in one pass:

```bash
find apps/web/src/i18n/locales -name "*.ts" -exec \
  sed -i "s/Open Design/NamVu Design/g; s/OpenDesign/NamVu Design/g" {} +
```

**Do not change** the TypeScript key names (e.g., `'app.brand'`, `'socialShare.openDesignSection'`) — only the string values on the right-hand side of the colon.

Notable keys this touches (representative, not exhaustive):
- `'app.brand': 'NamVu Design'` — the root brand string used everywhere
- `'settings.welcomeTitle': 'Welcome to NamVu Design'`
- `'settings.amrCloud': 'NamVu Design Cloud'`
- `'updater.*'` — all update dialog strings
- `'invite.*'` — all invite flow strings
- `'whatsNew.updatedTitle': 'NamVu Design {version} is here'`
- All `designFiles.usefulInfoTip*`, `chat.*`, `entry.*`, `dsFlow.*`, etc.

---

## B. Web Components — Hardcoded JSX Strings

These files have literal "Open Design" strings rendered directly in JSX or returned as display values (not via i18n keys). Replace each occurrence with "NamVu Design":

| File | What to change |
|---|---|
| `apps/web/src/components/HandoffButton.tsx:84` | `{ id: 'amr', name: 'Open Design', … }` → `'NamVu Design'` |
| `apps/web/src/components/HandoffButton.tsx:166` | `return agent.id === 'amr' ? 'Open Design' : agent.name` |
| `apps/web/src/components/InlineModelSwitcher.tsx:168,172` | Two `return agent.id === 'amr' ? 'Open Design' : …` |
| `apps/web/src/components/InlineModelSwitcher.tsx:1567` | `aria-label={\`Open Design ${amrInlineStatus}\`}` |
| `apps/web/src/components/InlineModelSwitcher.tsx:1586` | JSX text node `Open Design` |
| `apps/web/src/components/SkillDetailView.tsx:59` | `? 'Open Design'` (publisher display name) |
| `apps/web/src/components/PluginsView.tsx:2038` | `? 'Open Design'` (scope label) |
| `apps/web/src/components/PluginsView.tsx:3291` | `"bundled with Open Design and is ready to use"` |
| `apps/web/src/components/PluginsView.tsx:204–207` | `eyebrow: 'Open Design pull request'`, `fallbackTitle: 'Contribute Plugin to Open Design'`, description |
| `apps/web/src/components/DesignFilesPanel.tsx:1747` | `'Open Design PR'` button label |
| `apps/web/src/components/AssistantMessage.tsx:2324` | `"Open Design PR"` button label |
| `apps/web/src/components/AssistantMessage.tsx:2420` | Regex string `Open Design PR` |
| `apps/web/src/components/CommunityTemplatePreview.tsx:334` | `"Remix into a real Open Design project."` |
| `apps/web/src/components/XaiOAuthControl.tsx:322,335,348` | Three inline JSX messages |
| `apps/web/src/components/HomeView.tsx:1988,2013` | Error toast: `"Please update Open Design and try again."` |
| `apps/web/src/components/NewProjectPanel.tsx:794` | Same error toast string |
| `apps/web/src/components/ProjectView.tsx:11790` | `'Open Design PR'` button label |
| `apps/web/src/components/ProjectView.tsx:11809` | `'Ensure the Open Design fork exists'` |
| `apps/web/src/components/ProjectView.tsx:11930` | `'the run did not complete'` error message |
| `apps/web/src/components/ProjectView.tsx:904,993` | Two AI prompt strings mentioning "Open Design" |
| `apps/web/src/components/PromptTemplatesTab.tsx:19` | `'nexu-io/open-design': 'Open Design'` display label |
| `apps/web/src/components/home-hero/PixelScanLogo.tsx:16` | `label = 'Open Design'` default prop |
| `apps/web/src/components/home-hero/chips.ts:350` | hint string `'Author a reusable Open Design plugin…'` |
| `apps/web/src/components/home-hero/plugin-authoring.ts:33,48` | Two "Open Design" strings in plugin authoring prompts |
| `apps/web/src/components/plugin-details/PluginShareMenu.tsx:108` | Badge markdown: `Open Design-${title}` and `Open%20Design` in shield URL |
| `apps/web/src/components/use-everywhere/sections.ts` | Multiple section headings and body copy (lines 43, 45, 53, 55, 75, 86, 198–239, 296–313) |
| `apps/web/src/components/use-everywhere/agent-guide.ts:51,55,63,75` | Markdown guide text rendered to clipboard/modal |

**Execution:** For each file, do a targeted string replacement. A bulk sed across all component files works:

```bash
find apps/web/src/components -name "*.ts" -o -name "*.tsx" | xargs \
  sed -i "s/Open Design/NamVu Design/g"
```

**Exception — do NOT change:**
- Code identifiers: `OpenDesignHostBridge`, `OpenDesignHostBrowserClearDataOptions`, `OpenDesignComponent`, `isOpenDesignHostAvailable`, `OpenDesignGithubLatestReleaseResponse`, `__OpenDesignComponent`, `orderAgentsWithOpenDesignFirst` — these are TypeScript variable/function names, not display strings
- `apps/web/src/main/preload.cts` — the `OpenDesignHost*` type names are code identifiers only
- `apps/web/src/runtime/react-component.ts` — `OpenDesignComponent` is a generated JS variable name injected into sandboxed code

---

## C. Web Providers and Runtime — User-Visible Strings

| File | Lines | What to change |
|---|---|---|
| `apps/web/src/providers/daemon.ts:96` | truncation notice: `"Open Design truncated…"` |
| `apps/web/src/providers/daemon.ts:155` | `"Open Design detected…"` |
| `apps/web/src/providers/daemon.ts:463` | `"Open Design started, but the run did not complete"` |
| `apps/web/src/providers/daemon.ts:495` | `"Open Design service returned ${response.status}"` |
| `apps/web/src/providers/daemon.ts:571` | `"Check the Open Design link URL…"` |
| `apps/web/src/providers/daemon.ts:574` | `"Open Design authentication failed"` |
| `apps/web/src/runtime/exports.ts:154,245` | `'Open Design artifact'` (export default title) |
| `apps/web/src/runtime/exports.ts:268,299` | Two system prompt lines: `"free of Open Design chrome"` / `"Open Design chrome"` |
| `apps/web/src/runtime/brand-enrichment.ts:32` | `'AI optimize this Open Design design system in place.'` |

---

## D. Desktop App — User-Visible Strings

| File | Line | Change |
|---|---|---|
| `apps/desktop/src/main/update-menu.ts:25` | `"Restart to Update Open Design…"` → `"Restart to Update NamVu Design…"` |
| `apps/desktop/src/main/diagnostics.ts:42` | `"Export Open Design diagnostics"` → `"Export NamVu Design diagnostics"` |
| `apps/desktop/src/main/update-preflight.ts:23` | `"Open Design is still working on ${…} active task…"` |
| `apps/desktop/src/main/update-preflight.ts:29` | `"Open Design could not confirm…"` |

---

## E. Packaged Build / Installer — Product Names

### Mac

**`tools/pack/src/mac/constants.ts:1`**
```ts
// Before:
export const PRODUCT_NAME = "Open Design";
// After:
export const PRODUCT_NAME = "NamVu Design";
```

**`tools/pack/src/mac/app.ts:346`**
```ts
// Before:
description: "Open Design packaged runtime",
// After:
description: "NamVu Design packaged runtime",
```

### Linux

**`tools/pack/src/linux.ts:38`**
```ts
// Before:
const PRODUCT_NAME = "Open Design";
// After:
const PRODUCT_NAME = "NamVu Design";
```

**`tools/pack/src/linux.ts:574,667,668`**
```
author: "NamVu Design Team",
synopsis: "NamVu Design",
maintainer: "NamVu Design Contributors",
```

**`tools/pack/src/linux.ts:1552`**
```
`# NamVu Design headless launcher — namespace: ${config.namespace}`
```

### Windows

**`tools/pack/src/win/nsis.ts:46–58`** — The NSIS uninstaller strings. Replace all `"Open Design"` display text in the `LangString` declarations (lines 46–58 contain translations in multiple languages):
```
"Open Design data" → "NamVu Design data"
"Open Design" in Chinese/Portuguese/Russian/Persian translations
```

**`tools/pack/src/win/nsis.ts:131`**
```
DetailPrint "Removing local NamVu Design data: $odLocalDataRoot"
```

**`tools/pack/src/win/nsis.ts:62,65,97,100,117`** — Function names like `OpenDesignLocalDataPage`, `OpenDesignReadDownloadAttribution` are NSIS code identifiers — do NOT change.

**`tools/pack/src/win/app.ts:279`**
```ts
description: "NamVu Design packaged runtime",
```

**`tools/pack/src/win/payload.ts`** — `"payload/Open Design.exe"` references (lines 32, 50, 127, 331, 333) are filesystem paths for the actual EXE file. These must stay in sync with the actual binary name. If the Windows binary is renamed from `Open Design.exe` to `NamVu Design.exe`, update all references. If the binary is not renamed, leave these paths unchanged.

**`tools/pack/src/launcher-layout.ts:84`** — `Open Design-${namespaceToken}-payload.${...}` is a filename pattern for the payload archive. Change to `NamVu Design-${namespaceToken}-payload.${...}` if the archive naming should reflect the brand; otherwise leave as an internal artifact name.

---

## F. Daemon System Prompts

These strings are sent to the AI agent at runtime as part of its context. They contain "Open Design" in descriptions of what the product is.

**`apps/daemon/src/prompts/system.ts`** (~19 hits):
- Line 464: `Open Design Cloud models use the \`vela/*\` prefix.`
- Line 595: `### Open Design Cloud media defaults`
- Line 608: `This run uses Open Design's filesystem execution profile.`
- Line 1433: `<question-form>` assistant text description
- Line 1499–1507: Ask mode description: `"Open Design is the open-source Claude Design alternative"`
- Line 1511: Plan mode description
- All inline prose references

**`apps/daemon/src/prompts/official-system.ts`** (~4 hits):
- Line 47: `"Do not inherit Open Design app chrome colors."`
- Line 51: `data-od-id` explanation mentioning "Open Design"
- Line 108: `"Open Design tool wrappers"` reference

**`apps/daemon/src/prompts/core-slim.ts`**:
- Line 81: `# Open Design Charter` → `# NamVu Design Charter`

**`apps/daemon/src/prompts/media-contract.ts`**:
- Line 76: `Open Design-owned media execution is disabled`
- Line 222: `Open Design Cloud image and video models`

**`apps/daemon/src/prompts/discovery.ts`**:
- Line 44: `<question-form>` description mentioning "Open Design host"

Replace all occurrences of "Open Design" in these files that appear in string literals (not in TypeScript identifiers).

---

## G. Landing Page — Content Files

**`apps/landing-page/public/site.webmanifest`**:
```json
{
  "name": "NamVu Design",
  "short_name": "NamVu Design",
  "description": "The official NamVu Design site for the open-source, local-first Claude Design alternative."
}
```

**`apps/landing-page/public/llms.txt`**:
- Line 1: `# NamVu Design`
- Lines 3, 19, 23–24: all `"Open Design"` display references → `"NamVu Design"`
- Line 93, 97–98: canonical URL descriptions

**`apps/landing-page/functions/subscribe.ts`** (welcome email content):
- Line 54: `"Open Design <updates@open-design.ai>"` — change display name to `"NamVu Design <updates@open-design.ai>"` (keep the email address unless it's also being changed)
- Line 56: Subject: `"Welcome to NamVu Design — you're in 🎉"`
- Lines 59, 72, 80, 82, 91: All `"OpenDesign"` / `"Open Design"` in email body → `"NamVu Design"`

**`apps/landing-page/functions/codex-plugin.ts`**:
- Lines 79, 97, 99: "Open Design plugin installation guide", "Open Design for Codex" display text

**`apps/landing-page/scripts/fallback-preview-card.ts:368`**:
- `<span class="label">Open Design · Skill</span>` → `NamVu Design · Skill`

**`apps/landing-page/tests/`** — update test assertions that check for the exact "Open Design" / "OpenDesign" string in email subject, from-header, body text:
- `subscribe.test.ts:99,102,103,104` — update expected values to match the new brand strings
- `download-engagement-prompt.test.ts:298` — Chinese string containing `Open Design`, update to `NamVu Design`
- `header-download-cta.test.ts:132` — Chinese string update

---

## H. Skip (Code Identifiers — Do NOT Change)

These contain "OpenDesign" or "open-design" but are code identifiers, not display text:

- All `@open-design/*` package scope names in `package.json` files
- All `OpenDesignHost*` TypeScript interface/type names in `apps/desktop/src/main/preload.cts`
- `OpenDesignComponent` variable names in `apps/web/src/runtime/react-component.ts`
- `isOpenDesignHostAvailable` function name
- `OpenDesignGithubLatestReleaseResponse` type name
- `__OpenDesignComponent` global variable
- `orderAgentsWithOpenDesignFirst` function name
- NSIS function names: `OpenDesignLocalDataPage`, `OpenDesignReadDownloadAttribution`, `un.OpenDesignLocalDataPage`, `un.OpenDesignLocalDataPageLeave`
- `isAboutOpenDesign` function in `apps/landing-page/scripts/youtube-tutorials/lib.ts`
- `isOpenDesign` property in `apps/landing-page/scripts/youtube-tutorials/lib.ts`
- `OpenDesignBlogIndexingBot` user-agent string in `apps/landing-page/scripts/blog-indexing/verify-readiness.ts`
- Any TypeScript type/interface names across the codebase

---

## Execution Order

1. **i18n locales** (all 19 files) — bulk sed, highest ROI
2. **Web components** (bulk sed, then verify identifiers weren't touched)
3. **Web providers and runtime** (targeted)
4. **Desktop strings** (4 files, small)
5. **Pack constants and platform files** (mac/linux/win — small, precise)
6. **Daemon prompts** (system.ts, official-system.ts, core-slim.ts, media-contract.ts, discovery.ts)
7. **Landing page content** (manifest, llms.txt, subscribe.ts, scripts, tests)

---

## Verification

```bash
# 1. Check for remaining "Open Design" display strings (should only be identifiers)
grep -rn "Open Design\|OpenDesign" \
  apps/web/src apps/desktop/src apps/daemon/src tools/pack/src apps/landing-page/src \
  --include="*.ts" --include="*.tsx" \
  | grep -v "node_modules" \
  | grep -v "OpenDesign[A-Z]"   # filters out camelCase identifiers

# 2. Type-check to ensure no broken TS
pnpm typecheck

# 3. Web-specific type check
pnpm --filter @open-design/web typecheck

# 4. Guard
pnpm guard

# 5. Web unit tests (some landing page tests check brand strings — update expectations first)
pnpm --filter @open-design/web test
pnpm --filter @open-design/landing-page test

# 6. Manual smoke: start the app and verify
pnpm tools-dev
# Open UI — check:
# - Window title / app name shows "NamVu Design"
# - Settings welcome screen says "Welcome to NamVu Design"
# - Nav rail shows "NamVu Design" in relevant places
# - Update dialogs reference "NamVu Design"
# - No "Open Design" visible anywhere in the UI
```
