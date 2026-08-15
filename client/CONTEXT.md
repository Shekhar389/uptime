# Frontend App Context

## Architecture & Layout
- Framework: React + Vite + TypeScript.
- Design System: Vanilla CSS / Tailwind (if enabled) + UI Primitives (`src/components/ui/`).
- App Shell: `src/components/layout/AppShell.tsx` containing Sidebar and Header navigation.

## State & API Conventions
- Global App State: Managed via Zustand (`src/store/`).
- API Client: Centralized Axios / Fetch instance (`src/api/client.ts`) with request interceptors for auth header injection and global error handling.

## Directory Isolation
- Features are organized by domain under `src/features/{auth, uptime, incidents, status-pages, logs, billing}`.
- Reusable UI elements live strictly in `src/components/ui/`.
