# Uptime Domain Context

## Glossary
- **Monitor**: A target endpoint (HTTP, SSL, TCP, Ping) checked on a fixed schedule.
- **Heartbeat**: An inbound signal sent by cron jobs or background servers.
- **SLA**: Service Level Agreement percentage calculated over a rolling 30-day window.
- **UptimeEngine**: Deep module execution engine that coordinates checking, retry mechanisms, Axios HTTP pings, and availability metrics calculation behind a single seam interface.

## Invariants
- Minimum ping interval allowed is 10 seconds.
- A monitor is marked `down` only after 2 consecutive failed check attempts.
- All HTTP check pings must pass through the Axios client adapter seam (`src/shared/http/axios-client.ts`).
- External callers (routes, workers) must consume this module solely via `index.ts`. Never import from `internal/`.
