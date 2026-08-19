# ADR 0006: Direct Prisma Client Model Access in Services (Removal of Repository Layer)

## Context
The codebase previously maintained explicit Repository interfaces and classes (`IAuthRepository`, `PrismaAuthRepository`, `IUptimeRepository`, `MonitorRepository`, etc.) between Services and Prisma ORM delegates. Since Prisma ORM already acts as a type-safe Data Mapper and Query Builder abstraction over PostgreSQL models, maintaining explicit Repository interfaces created unnecessary boilerplate without providing practical abstraction benefits.

## Decision
Remove explicit Repository interfaces and implementations across all deep modules (`auth`, `incidents`, `uptime`).
Services will access Prisma model delegates directly via constructor injection (`constructor(private readonly dbClient = db)`).

## Key Standards
1. **DB Client Export**: `src/infrastructure/db/postgres/client.ts` exposes a `db` object containing singular model delegates (`db.user`, `db.organisation`, `db.monitor`, `db.incident`) and transaction helpers (`$transaction`, `$queryRaw`, `$executeRaw`).
2. **Dependency Injection**: Services inject `dbClient: typeof db = db` in constructors for testability.
3. **Transactions**: Multi-model atomic operations are performed directly in Service methods using `db.$transaction(async (tx) => { ... })`.
4. **Testing**: Service unit tests mock `dbClient` methods directly; integration tests assert against a real PostgreSQL test database.

## Consequences
- Reduces boilerplate and redundant repository wrapper classes across backend modules.
- Simplifies query writing directly within services using full Prisma type safety and auto-completion.
- Preserves dependency injection for unit testing.
