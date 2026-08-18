<template>
  <div className="flex min-h-screen w-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800">
    <!-- Sidebar -->
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between p-4 selection:bg-zinc-800">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 shadow">
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-base text-zinc-100 tracking-tight block">BetterPulse</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Uptime Suite</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all"
            :class="
              $route.path === item.to
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
            "
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <div className="pt-4 border-t border-zinc-900 px-2">
        <NuxtLink
          to="/login"
          class="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors py-2"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
          <span>Switch Account / Sign In</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content Seam -->
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <UIcon name="i-heroicons-building-office" class="w-4 h-4 text-zinc-300" />
          <span>Workspace:</span>
          <span className="text-zinc-100 font-semibold font-mono">{{ authStore.team?.name || 'Acme Corp' }}</span>
        </div>

        <div className="flex items-center gap-4">
          <UBadge variant="outline" class="bg-zinc-900 border-zinc-800 text-zinc-300 font-mono text-[11px] gap-2 px-2.5 py-1">
            <span class="h-2 w-2 rounded-full bg-zinc-100 animate-pulse" />
            SYSTEM NORMAL
          </UBadge>

          <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
            <UButton variant="ghost" class="relative h-9 w-9 rounded-full p-0 border border-zinc-800 hover:border-zinc-700">
              <UAvatar
                :text="authStore.user?.name ? authStore.user.name.substring(0, 2).toUpperCase() : 'DE'"
                class="bg-zinc-900 text-zinc-100 font-bold text-xs"
                size="sm"
              />
            </UButton>
          </UDropdown>
        </div>
      </header>

      <main className="flex-1 p-6 bg-zinc-950 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const navItems = [
  { to: '/', label: 'Monitors', icon: 'i-heroicons-chart-bar' },
  { to: '/incidents', label: 'Incidents', icon: 'i-heroicons-exclamation-triangle' },
  { to: '/status-pages', label: 'Status Pages', icon: 'i-heroicons-shield-check' },
  { to: '/logs', label: 'Log Explorer', icon: 'i-heroicons-command-line' },
  { to: '/billing', label: 'Billing', icon: 'i-heroicons-credit-card' },
];

const userMenuItems = [
  [
    {
      label: authStore.user?.name || 'Dev Engineer',
      slot: 'header',
      disabled: true,
    },
    {
      label: authStore.user?.email || 'dev@example.com',
      disabled: true,
    },
  ],
  [
    {
      label: 'Account Preferences',
      icon: 'i-heroicons-user',
    },
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => {
        authStore.logout();
        router.push('/login');
      },
    },
  ],
];
</script>
