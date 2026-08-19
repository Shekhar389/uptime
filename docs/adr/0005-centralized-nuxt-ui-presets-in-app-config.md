# ADR 0005: Centralized Component Theme Presets in app.config.ts

## Context
Across `client/` Vue component templates, Tailwind CSS utility class combinations (e.g. `bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl`) were being written repeatedly for common UI primitives such as cards, buttons, badges, inputs, and selects. To prevent utility code duplication and ensure design system consistency without introducing raw CSS variables or complex custom wrapper components, a canonical reusability mechanism is needed.

## Decision
Centralize all component styling defaults and theme presets in `client/app.config.ts` using Nuxt UI's (`@nuxt/ui`) native `ui` configuration object.

Key choices:
- **Strategy**: Configure `@nuxt/ui` theme presets globally in `client/app.config.ts` instead of using custom CSS `@apply` directives, raw CSS `:root` variables, or custom wrapper components.
- **Theme Palette**: Standardize on the Dark Zinc theme (`zinc` primary/gray palette).
- **Scope**: System-wide configuration covering:
  - `<UCard>`: default background `bg-zinc-900/90`, border `border-zinc-800/80`, ring `ring-1 ring-zinc-800`, rounded `rounded-xl`.
  - `<UButton>`: default `zinc` color palette, medium weight font, rounded `rounded-lg`.
  - `<UBadge>`: default subtle/outline variant with `font-mono text-xs rounded-md border border-zinc-800`.
  - `<UInput>` & `<USelect>`: default background `bg-zinc-950`, border `border-zinc-800`, text `text-zinc-100`, placeholder `placeholder-zinc-500`.

## Consequences
- Developers and AI agents do not need to rewrite utility class strings repeatedly across `.vue` templates.
- `@nuxt/ui` primitives automatically adopt the dark zinc design system defaults.
- Updated `client/CONTEXT.md` to establish `app.config.ts` as the single source of truth for component styling defaults.
