# ADR 0002: PostgreSQL for Relational Data

## Context
Core application entities (Users, Teams, Monitors, Incidents, Escalation Policies, Subscriptions) require strong ACID guarantees, relational joins, and foreign key integrity.

## Decision
Use PostgreSQL as the primary relational database.

## Consequences
- Reliable data model for user accounts and team configurations.
- Schema migrations using standard migration tools.
