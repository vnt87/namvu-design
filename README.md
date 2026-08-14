# NamVu Design

> A local-first, self-hostable fork of [Open Design](https://github.com/nexu-io/open-design).

NamVu Design keeps the original project's agent-native design workspace, but narrows the product focus to a private local installation that you control. It is intended for people who want to run the daemon, web app, desktop shell, agent integrations, projects, and generated artifacts on their own machine or infrastructure.

This repository is a fork, not a replacement for the original project. Please visit the [upstream Open Design repository](https://github.com/nexu-io/open-design) for the original product, its history, and upstream development.

## What this fork changes

### Local-first by default

- The application is designed to run locally with the daemon as the local runtime boundary.
- Projects, artifacts, configuration, agent runtime state, and local statistics remain under the daemon's managed data root. See the [daemon data directory contract](AGENTS.md#daemon-data-directory-contract) before changing deployment or storage behavior.
- Local agent CLIs and BYOK/OpenAI-compatible providers remain supported. Provider credentials are configured locally and are sent only to the provider selected by the user.
- The web UI, desktop shell, CLI, HTTP API, and MCP integrations continue to share the same local daemon APIs.

### Authentication removed

The application authentication layer has been removed from this fork. There are no product accounts, hosted sign-in flows, cloud sessions, subscription gates, billing flows, or application-level user identity requirements.

This makes the fork appropriate for a trusted local or private self-hosted environment. If you expose it beyond a trusted machine or private network, add authentication and access control at your reverse proxy, VPN, firewall, or hosting boundary.

### Telemetry removed

All product telemetry and remote observability collection has been removed or disabled, including remote product analytics, session replay, crash reporting, startup reporting, quality traces, safety telemetry, Prometheus metrics, OpenTelemetry reporting, and hosted analytics SDKs.

The app still records a small, bounded set of basic usage statistics locally so users can understand their own usage. These statistics are never uploaded and can be reviewed and reset from **Settings → Statistics** or through the `od statistics` CLI commands. See [PRIVACY.md](PRIVACY.md) for details.

## Summary of modifications so far

This fork currently includes:

- Removed the application authentication, account, cloud identity, billing, and hosted-session surfaces.
- Reworked the runtime toward local-only operation and local provider/BYOK configuration.
- Removed remote telemetry, analytics SDKs, session replay, crash/startup reporting, Langfuse reporting, Prometheus metrics, OpenTelemetry reporting, and telemetry-related packaging plumbing.
- Added a local SQLite statistics store with bounded semantic events, deduplication, filtering, pagination, retention across project deletion, and explicit reset.
- Added a Statistics dashboard in Settings with KPI cards, time-series charts, result breakdowns, model/provider/feature/tool views, advanced filters, raw event history, responsive layout, and reduced-motion support.
- Added matching `od statistics show`, `od statistics events`, and `od statistics reset --confirm` CLI commands.
- Kept the local daemon, desktop runtime, agent adapters, skills, design systems, templates, plugins, MCP integrations, artifact generation, and export workflows available.
- Updated privacy, contributor, deployment, release, and localization documentation to reflect the local-first model.
- Added focused contract, daemon persistence, web dashboard, telemetry, packaging, and configuration tests.

## Quick start

### Requirements

- Node.js `~24`
- pnpm `10.33.2`
- macOS, Linux, or WSL2 are the primary supported environments; Windows native is best-effort.

Using NVM:

```bash
nvm install 24
nvm use 24
corepack enable
corepack pnpm --version
```

Install dependencies and start the local web runtime:

```bash
pnpm install
pnpm tools-dev run web
```

Open the URL printed by `tools-dev`. To start the daemon, web app, and desktop shell in the background:

```bash
pnpm tools-dev
```

Useful commands:

```bash
pnpm tools-dev status
pnpm tools-dev logs
pnpm tools-dev stop
pnpm typecheck
pnpm guard
```

For the complete development, Docker, packaging, and deployment instructions, see [QUICKSTART.md](QUICKSTART.md).

## Local statistics

The local statistics dashboard is available at **Settings → Statistics**. It shows only bounded local events such as runs, artifacts, exports, provider/model usage, and outcomes. It does not store prompts, message bodies, arbitrary metadata, file contents, or credentials.

The same data is available from the CLI:

```bash
od statistics show --json
od statistics events --json
od statistics reset --confirm
```

## Project structure

- `apps/web` — Next.js web application
- `apps/daemon` — local daemon, HTTP API, agent spawning, skills, projects, and CLI
- `apps/desktop` — Electron desktop shell
- `apps/packaged` — packaged Electron runtime
- `apps/landing-page` — standalone public catalog and marketing site
- `packages/contracts` — shared web/daemon TypeScript contracts
- `design-systems` — reusable `DESIGN.md` brand systems
- `design-templates` — artifact templates for prototypes, decks, media, and documents
- `skills` — functional agent skills

See [docs/architecture.md](docs/architecture.md) and [AGENTS.md](AGENTS.md) for repository boundaries and contributor guidance.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a change. The local-first boundary is intentional: new features should not introduce hosted accounts, application authentication, remote telemetry, or hidden data collection.

## License

This fork retains the repository's Apache-2.0 license. Bundled skills, templates, and other third-party materials retain their own license files where applicable.

NamVu Design is an independent fork and is not affiliated with or endorsed by the maintainers of Open Design.
