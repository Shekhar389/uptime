# Backend Infrastructure Context

## Environment & Configuration
- Configuration is loaded via `dotenv` (`dotenv/config`) and strictly validated using Zod in `src/config/env.ts`.
- Mandatory environment variables: `PORT`, `HOST`, `NODE_ENV`, `POSTGRES_URL`, `CLICKHOUSE_URL`, `CLICKHOUSE_PASSWORD`, `REDIS_URL`, `LOG_LEVEL`.

## Security & Application Harness
- Built on **Fastify** with TypeScript.
- Middleware plugins:
  - `@fastify/helmet`: Production HTTP security header protection.
  - `@fastify/rate-limit`: Rate limiting middleware to prevent resource abuse.
  - `@fastify/cors`: Cross-Origin Resource Sharing control.
  - `@fastify/sensible`: Standardized HTTP utilities and status helpers.

## HTTP Client Seam
- Outgoing HTTP monitoring checks and API webhooks use an Axios client adapter (`src/shared/http/axios-client.ts`) with predefined timeouts, custom headers, and error handling seams.

## Database Conventions
- **PostgreSQL**: Handled via Prisma ORM with schema at `prisma/schema.prisma` and migrations at `prisma/migrations/`. Central DB pool and model delegates are exposed via `db` object in `src/infrastructure/db/postgres/client.ts`. Relational data (users, teams, monitors, incidents) are accessed through repository layers built on top of `db`.
- **ClickHouse**: Handled via `src/infrastructure/db/clickhouse/client.ts`. High-speed time-series data (ping logs, telemetry metrics).
- Local container services managed via `docker-compose.yml` (PostgreSQL 16, ClickHouse 24.3, Redis 7).

## Quality, Linting & Testing Pipeline
- **Linter**: `oxlint` (`.oxlintrc.json`) for sub-second static code analysis.
- **Formatter**: `prettier` (`.prettierrc`) for code formatting.
- **Testing**: `jest` with `ts-jest` runner (`jest.config.ts`).

## Logging & Observability
- Production-grade structured JSON logger implemented using Pino in `src/infrastructure/logger/index.ts`.
- Every request log is tagged with `requestId`, `teamId` (when authenticated), and response metrics.

## Error Format
- Custom errors inherit from `AppError` (`src/shared/errors/app-error.ts`).
- Fastify error handler (`src/api/middlewares/error.middleware.ts`) serializes error responses into standard payload: `{ error: string, statusCode: number, timestamp: string }`.
