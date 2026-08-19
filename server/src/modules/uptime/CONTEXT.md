# Uptime Domain Context

## Glossary
- **Monitor**: A target endpoint (HTTP, SSL, TCP, Ping) checked on a fixed schedule.
- **Heartbeat**: An inbound signal sent by cron jobs or background servers.
- **SLA**: Service Level Agreement percentage calculated over a rolling 30-day window.
- **UptimeEngine**: Deep module execution engine that coordinates checking, retry mechanisms, Axios HTTP pings, and availability metrics calculation behind a single seam interface.

## Invariants
- Minimum ping interval allowed is 3 minutes (180 seconds). Default interval is 5 minutes (300 seconds).
- All monitors are scoped strictly to an `organisation_id`.
- A monitor is marked `down` only after 2 consecutive failed check attempts (`consecutiveFails >= 2`). Single failure resets or increments count without flipping status to `down`.
- Monitors store `lastCheckedAt` and `consecutiveFails` to track check schedules and status transitions.
- Background cron runner runs every 60 seconds using a simple execution lock (`isProcessing`) to prevent tick overlaps.
- Monitor checks are executed in bounded batches (concurrency limit 15) to avoid socket/resource exhaustion.
- Healthy HTTP range is status code `200 <= status < 400` with 5000ms timeout; degraded status, incidents, and telemetry logs are ignored for now.
- All HTTP check pings must pass through the Axios client adapter seam (`src/shared/http/axios-client.ts`).
- External callers (routers, workers) must consume this module solely via `index.ts`. Never import from `internal/`.


