# Billing Domain Context

## Glossary
- **Plan**: Subscription tier (`free`, `pro`, `enterprise`).
- **Quota**: Execution limit for a team (e.g., maximum active monitors).

## Invariants
- Teams on `free` tier are capped at 5 monitors.
- Exceeding quota throws `QuotaExceededError`.
