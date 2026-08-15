# Incidents Domain Context

## Glossary
- **Incident**: An event indicating service interruption or performance degradation.
- **Escalation Policy**: Sequential rules determining who is alerted when an incident triggers.

## Invariants
- An incident must belong to a valid `monitor_id` and `team_id`.
- Resolving an incident timestamps `resolved_at`.
