# Global System Context

## Core System Entities
- **User**: Individual identity with authentication credentials, profile settings, and membership in one or more Teams.
- **Team**: Organizational workspace owning Monitors, Incidents, Status Pages, and Subscriptions.
- **Role**: Permission level within a team (`owner`, `admin`, `member`, `viewer`).

## Cross-Cutting Principles
1. **Multi-tenancy**: All domain entities belong strictly to a `team_id`.
2. **Telemetry isolation**: High-frequency metric/log writes go to ClickHouse, relational domain data stays in PostgreSQL.
3. **Structured Logging**: Every log entry includes `correlation_id`, `team_id`, and `service_name`.
