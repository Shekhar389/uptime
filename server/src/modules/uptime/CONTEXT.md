# Uptime Domain Context

## Glossary
- **Monitor**: A target endpoint (HTTP, SSL, TCP, Ping) checked on a fixed schedule.
- **Heartbeat**: An inbound signal sent by cron jobs or background servers.
- **SLA**: Service Level Agreement percentage calculated over a rolling 30-day window.

## Invariants
- Minimum ping interval allowed is 10 seconds.
- A monitor is marked `down` only after 2 consecutive failed check attempts.
- External callers (routes, workers) must consume this module solely via `index.ts`.
