# Frontend App Context

## Architecture & Tooling Stack
- **Framework & Compiler**: Nuxt 3 (SPA mode, `ssr: false`) + Vue 3 + Vite + TypeScript (Strict).
- **Design System & Component Library**: **Nuxt UI** (`@nuxt/ui`) components (`<UButton>`, `<UCard>`, `<UTable>`, `<UModal>`, `<UBadge>`, `<USelect>`, `<UTabs>`, `<UInput>`, `<UForm>`).
- **Styling**: Tailwind CSS + Nuxt UI theme presets centralized in `app.config.ts` (`docs/adr/0005-centralized-nuxt-ui-presets-in-app-config.md`). Avoid inline utility duplication or raw CSS `:root` variables.
- **App Shell & Routing**: Nuxt file-based routing (`pages/`) with layout templates (`layouts/default.vue`, `layouts/auth.vue`).
- **Package Manager**: `pnpm` exclusively across all commands and package management.
- **Code Quality**: oxlint + Prettier + Vitest with `@nuxt/test-utils`.

## State & API Conventions
- **Global App State**: Managed via **Pinia** stores (`stores/{auth, uptime, incidents, billing}.ts`) with Nuxt auto-imports. `stores/auth.ts` initializes in an unauthenticated state (`isAuthenticated = false`) by default and hydratessession state (token, user, organization) from `localStorage` on client init.
- **API Client Seam**: Centralized `$fetch` wrapper composable (`composables/useApiClient.ts`) with request interceptors for injecting `Authorization: Bearer <token>` and `X-Organisation-ID` / `X-Team-ID` headers, and response interceptors for error handling.
- **Form & Validation Seams**: Nuxt UI `<UForm>` + **Zod** schema validation (`utils/schemas/*.ts` or feature schemas) with native `<UForm :schema="schema">`.
- **Domain Modeling**: Primary workspace entity is `Organisation` (`organisationId`, `oid`), represented in `stores/auth.ts` and user signup form.

## Directory Isolation & Deep Modules
- **File-Based Routing & Protection**: Pages under `pages/`, shared layouts under `layouts/`, and global route guard under `middleware/auth.global.ts` enforcing authentication on protected dashboard routes and redirecting unauthenticated users with `redirect` query parameter.
- **Composables & Stores**: Domain logic contained within auto-imported `composables/` and `stores/`.
- **Tests**: Verified using Vitest + `@nuxt/test-utils` (`pnpm --filter client test`).
