export default defineAppConfig({
  ui: {
    primary: 'zinc',
    gray: 'zinc',
    card: {
      background: 'bg-zinc-900/90',
      divide: 'divide-zinc-800',
      ring: 'ring-1 ring-zinc-800/80',
      rounded: 'rounded-xl',
      shadow: 'shadow-sm',
      header: {
        base: 'border-b border-zinc-800/80 px-4 py-4 sm:px-6',
      },
      footer: {
        base: 'border-t border-zinc-800/80 px-4 py-4 sm:px-6',
      },
    },
    button: {
      rounded: 'rounded-lg',
      font: 'font-medium',
      default: {
        color: 'white',
      },
    },
    badge: {
      rounded: 'rounded-md',
      font: 'font-mono text-xs',
      default: {
        variant: 'subtle',
      },
    },
    input: {
      rounded: 'rounded-lg',
      color: {
        white: {
          outline: 'bg-zinc-950 text-zinc-100 ring-1 ring-zinc-800 focus:ring-2 focus:ring-zinc-700 placeholder-zinc-500',
        },
      },
    },
    select: {
      rounded: 'rounded-lg',
      color: {
        white: {
          outline: 'bg-zinc-950 text-zinc-100 ring-1 ring-zinc-800 focus:ring-2 focus:ring-zinc-700',
        },
      },
    },
  },
});

