# Remove Authentication — Single-Tenant Mode

## Context

The app currently has four auth layers protecting features from unauthenticated access:

1. **Vela/AMR user auth** — OAuth device-flow sign-in via `vela` CLI; drives workspace, billing, cloud agent access
2. **OD_API_TOKEN middleware** — static env-var gate on all `/api/*` requests from non-loopback origins
3. **Tool request auth** (`apps/daemon/src/http/tool-request-auth.ts`) — internal Bearer tokens scoping AI agent tool calls; **keep as-is** — this is runtime infrastructure, not user auth
4. **Desktop import auth** (`apps/daemon/src/desktop-auth.ts`) — HMAC tokens for desktop → daemon import; **keep as-is** — internal mechanism unrelated to user login

Goal: remove (1) and (2). Tear out all workspace/collab cloud features (they require cloud auth by nature and cannot work without it). Every local feature becomes accessible without login.

---

## A. Daemon — Remove OD_API_TOKEN Middleware

**`apps/daemon/src/server.ts`**
- Delete the entire `if (apiTokenAuthEnabled) { ... }` block (lines 2543–2604)
- Remove the locals that fed it near line 2498–2502: `apiTokenAuthEnabled`, `apiAuthDisabled`, `apiToken`
- Remove the import of `isApiTokenMiddlewareEnabled` (line ~988)

**`apps/daemon/src/api-token-auth.ts`**
- Delete file entirely (only consumed by the block above)

---

## B. Daemon — Remove Vela/AMR Login Routes

**`apps/daemon/src/routes/vela.ts`**
- Delete file entirely

**`apps/daemon/src/server.ts`**
- Remove `registerVelaRoutes(...)` call and its import

Routes removed: `GET /api/integrations/vela/status`, `POST /api/integrations/vela/login`, `POST /api/integrations/vela/login/cancel`, `POST /api/integrations/vela/logout`, `GET /api/integrations/vela/wallet`, `GET /api/amr/models`, `/api/integrations/vela/api-proxy/*`, `/api/integrations/vela/message-center/*`, analytics mirror endpoints.

---

## C. Daemon — Remove Workspace/Collab Routes

**`apps/daemon/src/routes/collab-context.ts`**
- Delete file entirely (all `/api/workspace/*` routes)

**`apps/daemon/src/server.ts`**
- Remove the `registerCollabContextRoutes(...)` call and its import

**`apps/daemon/src/collab/workspace-context.ts`**
- Delete after verifying no non-collab callers (`grep -r "workspace-context" apps/daemon/src --include="*.ts"`)

**`apps/daemon/src/collab/project-request-authority.ts`**
- Delete after verifying no remaining callers

> Note: `authorizeProjectRequest` in per-project routes (`chat.ts`, `terminal.ts`, `deploy.ts`, `genui.ts`, `handoff.ts`, `media.ts`, `host-tools.ts`, `routes/project/conversations.ts`, `routes/live-artifact.ts`, `routes/plugins/index.ts`, `routes/design-systems.ts`, `routes/runs.ts`) is documented as a **no-op passthrough when there's no workspace binding**. Since removing collab means no workspace is ever bound, these checks become inert. Remove them if they import from now-deleted files; otherwise leave them (they'll be dead code that does nothing).

---

## D. Web — Remove amrLoginStatus State and Prop Threading

**`apps/web/src/App.tsx`**
- Remove `amrLoginStatus` state (`useState<VelaLoginStatus | null>(null)`, line ~1580)
- Remove the polling/sync effects that call `/api/integrations/vela/status` (lines ~1649–1680)
- Remove `amrAuthorized` derivation in `deriveConfigureGlobals` (line ~1771) — remove the analytics dimension or replace with a constant `false`
- Remove all props derived from `amrLoginStatus` passed to `EntryShell`: `amrLoggedIn`, `amrSessionState`, `amrAccount`, `amrLoginProfile`, etc.
- Remove `amrAuthRetryContinuation` state and the sign-in → run-retry re-fire logic (lines ~1320)

---

## E. Web — Remove EntryShell Auth Gates

**`apps/web/src/components/EntryShell.tsx`**
- Remove `amrLoggedIn`, `amrSessionState`, `amrAccount` props from the component signature
- Delete the `useEffect` redirect block (lines 634–642):
  ```ts
  const selectedCloudIdentityRejected = usesOpenDesignCloud && amrLoggedIn === false;
  if ((!selectedCloudIdentityRejected && !amrAuthRequired) || view === 'onboarding') return;
  navigate({ kind: 'home', view: 'onboarding' }, { replace: true });
  ```
- Remove `handleCloudSignIn()` / `continueAfterCloudSignIn()` onboarding flow
- Remove `<CloudSignInTip />` render (line ~648) — the nav rail footer should be hidden when no account info is present
- Remove `<AmrBalanceDialog />` mount
- Remove `amrAuthRequired` derivation (depends on workspace context state)

**`apps/web/src/components/entry-rail-account-state.ts`**
- Simplify `resolveEntryRailAccountFooterState` to always return `'hidden'`

---

## F. Web — Delete Auth-Only UI Components

Delete these files entirely after removing all import sites (grep each filename before deleting):

| File | Notes |
|---|---|
| `apps/web/src/components/AmrLoginPill.tsx` | Sign-in button shown in chat and nav |
| `apps/web/src/components/CloudSignInTip.tsx` | Sign-in callout in nav rail footer |
| `apps/web/src/components/SignOutConfirmDialog.tsx` | Sign-out confirmation modal |
| `apps/web/src/components/AmrArtifactUpgradeGate.tsx` | Upgrade prompt blocking artifact actions |
| `apps/web/src/runtime/amr-artifact-upgrade.ts` | Logic backing the upgrade gate |
| `apps/web/src/analytics/amr-auth.ts` | `setAnalyticsUserId` wiring — remove call sites first |
| `apps/web/src/components/amrLoginPolling.ts` | Either delete or stub: export `isAmrSessionAuthenticated = () => true` |

---

## G. Web — Remove Workspace/Collab UI

**`apps/web/src/collab/` (entire directory)**
- Delete all files: team projects listing, collab presence, invite UI, workspace context hook
- Grep for all import sites: `useWorkspaceContext`, `WorkspaceCollabContext`, workspace invite components, team project views

**`apps/web/src/components/AvatarMenu.tsx`**
- Remove lines gated on `amrAccount?.loggedIn` — plan/billing display (lines ~262–278)

**`apps/web/src/components/SettingsDialog.tsx`**
- Remove `settings-cloud-signin-callout` section (lines ~4423–4439)
- Remove AMR Authorize button (line ~4938)

**`apps/web/src/components/InlineModelSwitcher.tsx`**
- Remove `amrPlanLabel`, `amrBalanceLabel`, `amrBalanceDisplayLabel` (lines ~872–949)
- Remove upgrade and recharge CTAs (lines ~1588–1610)
- Remove the sign-in CTA shown when `!amrLoggedIn`

---

## H. Contracts — Remove AMR Auth Types

**`packages/contracts/src/api/amr-auth.ts`**
- Grep for remaining consumers of `AmrSessionState` and `AmrSessionStatus` across the codebase
- If no non-auth consumers remain, delete the file
- If still imported elsewhere, leave the file but note it as cleanup debt

---

## What Is NOT Changing

- `apps/daemon/src/http/tool-request-auth.ts` — internal auth between daemon and AI agent subprocesses; leave untouched
- `apps/daemon/src/desktop-auth.ts` — internal HMAC auth for desktop → daemon local import; leave untouched
- All local project features: chat/runs, terminals, deployments, media generation, design systems, plugins, genui, handoff — these continue working in single-player mode; their `authorizeProjectRequest` calls are already no-ops without a workspace binding

---

## Execution Order

Work through the layers in this order to minimize cascading type errors at each step:

1. Daemon infra: delete `api-token-auth.ts`, remove the middleware block from `server.ts`
2. Daemon routes: delete `routes/vela.ts` and `routes/collab-context.ts`, remove their registrations in `server.ts`
3. Daemon collab: delete `collab/workspace-context.ts` and `collab/project-request-authority.ts` after verifying no callers remain
4. Web contracts: handle `packages/contracts/src/api/amr-auth.ts`
5. Web polling/state: remove `amrLoginStatus` state + polling effects in `App.tsx`
6. Web prop threading: remove `amrLoggedIn`/`amrSessionState`/`amrAccount` props passed from `App.tsx` → `EntryShell`
7. Web component removal: delete `AmrLoginPill`, `CloudSignInTip`, `SignOutConfirmDialog`, `AmrArtifactUpgradeGate`, `amr-artifact-upgrade.ts`, `amr-auth.ts`
8. Web EntryShell cleanup: remove redirect effect, auth-gated renders, sign-in onboarding flow
9. Web collab directory: delete `apps/web/src/collab/`
10. Web targeted cleanup: `AvatarMenu.tsx`, `SettingsDialog.tsx`, `InlineModelSwitcher.tsx`

---

## Verification

```bash
# Type-check everything — catches dead references from deleted files
pnpm typecheck
pnpm --filter @open-design/web typecheck
pnpm --filter @open-design/daemon typecheck

# Guard — catches boundary violations and unexpected JS files
pnpm guard

# Unit tests
pnpm --filter @open-design/daemon test
pnpm --filter @open-design/web test

# Manual smoke test
pnpm tools-dev
# Open web UI — verify:
# - No redirect to onboarding on load
# - No sign-in prompts anywhere in the UI
# - Local project features (chat, files, design systems, etc.) load and work
# - Nav rail has no sign-in callout in the footer
# - Settings dialog has no cloud auth section
```
