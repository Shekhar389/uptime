<template>
  <div class="w-full max-w-md space-y-6">
    <!-- Brand Header -->
    <div class="flex flex-col items-center space-y-2 text-center">
      <div class="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 shadow-md">
        <UIcon name="i-heroicons-chart-bar" class="w-7 h-7 stroke-[2.5]" />
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-zinc-100">BetterPulse</h1>
      <p class="text-xs text-zinc-400 font-mono uppercase tracking-widest">
        Enterprise Uptime & Infrastructure Telemetry
      </p>
    </div>

    <!-- Nuxt UI Card Login Form -->
    <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
      <template #header>
        <div class="space-y-1 text-center pb-2">
          <h2 class="text-xl font-bold tracking-tight text-white">Sign in to account</h2>
          <p class="text-xs text-zinc-400">
            Enter your corporate credentials to access workspace SLA telemetry
          </p>
        </div>
      </template>

      <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="EMAIL ADDRESS" name="email" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="name@company.com"
            class="bg-zinc-950 border-zinc-800 text-zinc-100"
          />
        </UFormGroup>

        <UFormGroup label="PASSWORD" name="password" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <template #hint>
            <a href="#forgot" class="text-xs text-zinc-400 hover:text-zinc-100 underline transition-colors normal-case">
              Forgot?
            </a>
          </template>
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="bg-zinc-950 border-zinc-800 text-zinc-100"
          />
        </UFormGroup>

        <div class="pt-2">
          <UButton
            type="submit"
            block
            class="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold gap-2 py-3 shadow-lg"
          >
            Sign In <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Navigation link to register -->
    <div class="text-center text-xs text-zinc-400">
      Don't have an account?
      <NuxtLink to="/register" class="text-zinc-100 hover:underline font-semibold ml-1">
        Create an account
      </NuxtLink>
    </div>

    <!-- Footer info -->
    <div class="flex items-center justify-center gap-2 text-xs text-zinc-500">
      <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
      <span>Secured by 256-bit TLS Encryption & OAuth2 Seam</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginSchema } from '~/utils/schemas/auth';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();

const state = reactive({
  email: 'dev@example.com',
  password: 'password123',
});

const onSubmit = () => {
  authStore.setAuth({
    user: { id: 'usr-1', name: 'Dev Engineer', email: state.email },
    team: { id: '00000000-0000-0000-0000-000000000001', name: 'Acme Corp' },
    token: 'dev-session-token',
  });
  router.push('/');
};
</script>
