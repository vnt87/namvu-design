# Privacy

NamVu Design does not send product analytics, session replay, quality traces,
crash reports, startup reports, or safety telemetry to NamVu Design or to an
analytics provider. The public website does not load analytics or attribution
trackers.

The app keeps a small local statistics history so you can understand your own
usage. It records bounded semantic events such as run results, duration, token
counts, tools used, artifact/export counts, model/provider identifiers, and
feature names. It does not store prompts, assistant responses, tool payloads,
artifact contents, credentials, stack traces, arbitrary event properties, or a
person/device analytics identifier.

Local statistics are stored in the daemon's SQLite database under the resolved
daemon data root. They are available only through the local daemon, the
**Settings → Statistics** dashboard, and `od statistics`. Statistics remain
independent of project and conversation deletion so longer-term trends stay
useful. Use **Settings → Statistics → Clear statistics** or
`od statistics reset --confirm` to delete the complete history immediately.

Model-backed features still send the request data required by the runtime or
provider you choose. Hosted account, authentication, payment, billing, fraud
prevention, and model-routing systems may also process the operational data
needed to provide those services. Those provider/service flows are not app
telemetry and are governed by their applicable terms and privacy policies.

BYOK credentials remain local and are used only to call the provider you
configured. They are never included in local statistics.

This document tracks shipped data handling. For questions, open a
[GitHub Discussion](https://github.com/nexu-io/open-design/discussions).
