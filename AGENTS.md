# AGENTS.md

## AI Development Guidelines

### Context & Domain Pointers
Before working on any code, consult `CONTEXT-MAP.md` to locate the relevant domain context file.
- DO NOT read context files for unrelated modules.
- ALWAYS update the target module's `CONTEXT.md` inline whenever a domain term, rule, or invariant changes.

### Module Boundaries
- Every module in `server/src/modules/` is a DEEP MODULE.
- External code (routers, workers, other modules) MUST call the module ONLY through its public seam `index.ts`. Never import from `internal/`.
- Frontend code (`client/`) MUST use **pnpm** exclusively, **Nuxt 3** with `ssr: false` (SPA mode), **Nuxt UI** (`@nuxt/ui`), **Pinia** for global state (`stores/`), **$fetch** wrapper composable (`composables/useApiClient.ts`), **Zod** schema validation for forms (`<UForm :schema="schema">`), and **Vitest + `@nuxt/test-utils`** for testing (`pnpm --filter client test`).

### Commit & Review Policy
- NEVER commit code changes automatically after implementation, testing, or cleanup.
- ALWAYS submit work for final user review and await explicit user approval before committing.

## Agent skills

### Issue tracker
Issues and specs live as local markdown files in `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels
Canonical triage label mapping for issue tracking. See `docs/agents/triage-labels.md`.

### Domain docs
Single-context domain documentation layout (`CONTEXT.md` and `docs/adr/`). See `docs/agents/domain.md`.
    