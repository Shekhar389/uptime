# Backend Infrastructure Context

## Environment & Configuration
- Configuration is loaded and strictly validated using Zod in `src/config/env.ts`.
- Mandatory environment variables: `PORT`, `NODE_ENV`, `POSTGRES_URL`, `CLICKHOUSE_URL`, `CLICKHOUSE_PASSWORD`.

## Database Conventions
- **PostgreSQL**: Handled via `src/infrastructure/db/postgres/client.ts`. Relational data (users, teams, monitors, incidents).
- **ClickHouse**: Handled via `src/infrastructure/db/clickhouse/client.ts`. High-speed time-series data (ping logs, telemetry metrics).

## Logging & Observability
- Production-grade structured JSON logger implemented using Pino in `src/infrastructure/logger/index.ts`.
- Every request log is tagged with `requestId`, `teamId` (when authenticated), and response metrics.

## Error Format
- Custom errors inherit from `AppError` (`src/shared/errors/app-error.ts`).
- Fastify error handler (`src/api/middlewares/error.middleware.ts`) serializes error responses into standard payload: `{ error: string, statusCode: number, timestamp: string }`.
