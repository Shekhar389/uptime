# ADR 0004: Migrate Frontend from React + Shadcn to Nuxt 3 (SSR Off) + Nuxt UI

## Context
The existing frontend architecture relied on React 19, Vite, React Router v7, Redux Toolkit, and manual Shadcn UI primitive copies. To streamline developer experience, adopt native file-based routing, leverage cohesive UI primitives, and standardize composables and state management without server-side rendering complexity, the frontend needs a unified framework overhaul.

## Decision
Migrate the `client/` application from React + Shadcn UI to **Nuxt 3** in **SPA mode** (`ssr: false`) using **Nuxt UI** (`@nuxt/ui`).

Key technical choices:
- **Framework**: Nuxt 3 in Single-Page Application (SPA) mode (`ssr: false` in `nuxt.config.ts`).
- **UI Component System**: Nuxt UI (`@nuxt/ui`) with centralized theme token configuration in `app.config.ts`.
- **State Management**: **Pinia** stores under `stores/` replacing Redux Toolkit slices.
- **Forms & Validation**: Nuxt UI native `<UForm>` components integrated with **Zod** schema definitions.
- **HTTP / API Client**: Custom `$fetch` / `useApiClient` composable with request & response interceptors replacing Axios.
- **Routing & Layouts**: Nuxt file-based routing in `pages/` with `layouts/default.vue` and `layouts/auth.vue`.
- **Route Guarding**: Nuxt global route middleware in `middleware/auth.global.ts`.
- **Testing**: Vitest with `@nuxt/test-utils` (`pnpm --filter client test`).

## Consequences
- Requires re-initializing the `client/` workspace package for Nuxt 3 and `@nuxt/ui`.
- Replaces React JSX components with Vue 3 SFC (`.vue`) templates and Nuxt UI components.
- Simplifies routing, layout composition, and composable auto-imports.
- Updated governance standards in `AGENTS.md` and `client/CONTEXT.md`.
