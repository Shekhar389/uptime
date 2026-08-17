# Frontend App Context

## Architecture & Tooling Stack
- **Framework & Compiler**: React 19 + Babel React Compiler + Vite + TypeScript (Strict).
- **Design System & Component Library**: Official **Shadcn UI** primitives initialized via `pnpm dlx shadcn@latest` (`components.json`) in `src/components/ui/` (`Card`, `Table`, `Badge`, `Button`, `Input`, `Dialog`, `Select`, `DropdownMenu`, `Tabs`, `Avatar`, `Separator`).
- **Styling**: Tailwind CSS + Shadcn HSL CSS theme variables (`src/index.css`) + `cn` helper (`src/lib/utils.ts`).
- **App Shell & Routing**: `src/components/layout/AppShell.tsx` + React Router v7 (`src/router/`).
- **Package Manager**: `pnpm` exclusively across all commands and package management.
- **Code Quality**: oxlint + Prettier + Vitest (`happy-dom`).

## State & API Conventions
- **Global App State**: Managed via **Redux Toolkit** slices (`src/store/slices/{auth, uptime, incidents, billing}Slice.ts`) with typed hooks (`useAppDispatch`, `useAppSelector` in `src/store/hooks.ts`).
- **API Client Seam**: Centralized **Axios** instance (`src/api/axios.ts` / `src/api/client.ts`) with request interceptors for injecting `Authorization: Bearer <token>` and `X-Team-ID` headers, and response interceptors for standardized error handling.
- **Form & Validation Seams**: React Hook Form + **Zod** schema validation (`src/features/*/schemas.ts`) with `@hookform/resolvers/zod`.

## Directory Isolation & Deep Modules
- **Feature Modules**: Organized by domain under `src/features/{auth, uptime, incidents, status-pages, logs, billing}`.
- **Official Shadcn UI Primitives**: Built strictly in `src/components/ui/` using `@radix-ui/react-*` and `class-variance-authority`.
- **Tests**: Located alongside modules under `__tests__/` and verified using Vitest (`pnpm --filter client test`).
