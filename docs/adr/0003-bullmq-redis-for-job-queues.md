# ADR 0003: BullMQ & Redis for Job Queues

## Context
High-frequency HTTP checks, email/SMS alert dispatches, and billing sync jobs need background execution with retries, rate limiting, and concurrency control.

## Decision
Use BullMQ powered by Redis for reliable background job processing and caching.

## Consequences
- Decoupled API response loop from background execution.
- Configurable worker concurrency and retry strategies.
