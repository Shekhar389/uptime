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
    <UCard>
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
          />
        </UFormGroup>

        <div class="pt-2">
          <UButton
            type="submit"
            block
            color="white"
            variant="solid"
            :loading="loading"
            class="bg-zinc-100 hover:bg-white text-zinc-950 font-bold gap-2 py-3 shadow-lg justify-center flex items-center"
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
import { ref, reactive } from 'vue';
import { loginSchema } from '~/utils/schemas/auth';
import { useAuthStore } from '~/stores/auth';
import { useApiClient } from '~/composables/useApiClient';

definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const api = useApiClient();
const toast = useToast();

const loading = ref(false);

const state = reactive({
  email: '',
  password: '',
});

const onSubmit = async () => {
  loading.value = true;
  try {
    const response = await api<any>('/auth/login', {
      method: 'POST',
      body: {
        email: state.email,
        password: state.password,
      },
    });

    authStore.setAuth({
      user: response.user,
      organisation: response.organisation,
      token: response.token,
    });

    toast.add({
      title: 'Welcome Back',
      description: `Signed in successfully as ${response.user?.name || response.user?.email || state.email}`,
      color: 'green',
    });

    const targetPath = (route.query.redirect as string) || '/';
    router.push(targetPath);
  } catch (err: any) {
    toast.add({
      title: 'Login Failed',
      description: err.message || 'Invalid email or password.',
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};
</script>
