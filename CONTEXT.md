# Global System Context

## Core System Entities
- **User**: Individual identity with authentication credentials, profile settings, and membership in an Organisation.
- **Organisation**: Company or group workspace owning Monitors, Incidents, Status Pages, and Subscriptions. Identified uniquely by `id` (UUID) and `oid` (human-readable slug identifier). Has status (`active`, `inactive`).
- **Role**: Permission level within an organisation (`owner`, `admin`, `member`, `viewer`).

## Cross-Cutting Principles
1. **Multi-tenancy**: All domain entities belong strictly to an `organisation_id`.
2. **Telemetry isolation**: High-frequency metric/log writes go to ClickHouse, relational domain data stays in PostgreSQL.
3. **Structured Logging**: Every log entry includes `correlation_id`, `organisation_id`, and `service_name`.
