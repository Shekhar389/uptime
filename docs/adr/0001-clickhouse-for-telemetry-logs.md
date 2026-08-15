# ADR 0001: ClickHouse for Telemetry Logs & Ping Metrics

## Context
High-frequency ping checks (every 10s across thousands of monitors) produce massive volumes of time-series data and logs. PostgreSQL relational storage would face write amplification and query performance bottlenecks.

## Decision
Use ClickHouse as a dedicated time-series and log database.

## Consequences
- Fast columnar analytics and aggregation for uptime SLAs and latency histograms.
- High write throughput for ping results and telemetry events.
- Requires separate client configuration and migrations.
