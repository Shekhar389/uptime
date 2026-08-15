# AGENTS.md

## AI Development Guidelines

### Context & Domain Pointers
Before working on any code, consult `CONTEXT-MAP.md` to locate the relevant domain context file.
- DO NOT read context files for unrelated modules.
- ALWAYS update the target module's `CONTEXT.md` inline whenever a domain term, rule, or invariant changes.

### Module Boundaries
- Every module in `server/src/modules/` is a DEEP MODULE.
- External code (routers, workers, other modules) MUST call the module ONLY through its public seam `index.ts`. Never import from `internal/`.
- Frontend code (`client/`) MUST use **pnpm** exclusively, **Redux Toolkit** for global state (`src/store/`), **Axios** with request/response interceptors (`src/api/axios.ts`), **React Hook Form + Zod** schemas for forms (`src/features/*/schemas.ts`), **official Shadcn UI primitives** installed via `pnpm dlx shadcn@latest` (`src/components/ui/`), and **Vitest** for testing (`pnpm --filter client test`).

## Agent skills

### Issue tracker
Issues and specs live as local markdown files in `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels
Canonical triage label mapping for issue tracking. See `docs/agents/triage-labels.md`.

### Domain docs
Single-context domain documentation layout (`CONTEXT.md` and `docs/adr/`). See `docs/agents/domain.md`.
