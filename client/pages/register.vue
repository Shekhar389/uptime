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

    <!-- Nuxt UI Card Register Form -->
    <UCard>
      <template #header>
        <div class="space-y-1 text-center pb-2">
          <h2 class="text-xl font-bold tracking-tight text-white">Create an Account</h2>
          <p class="text-xs text-zinc-400">
            Set up your identity and workspace organisation
          </p>
        </div>
      </template>

      <!-- Organisation Selection Mode Tabs -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        class="mb-4"
        @change="onTabChange"
      />

      <UForm :schema="signupSchema" :state="state" class="space-y-4" @submit="onSubmit">
        <!-- User Details -->
        <UFormGroup label="FULL NAME" name="name" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <UInput
            v-model="state.name"
            placeholder="Jane Doe"
          />
        </UFormGroup>

        <UFormGroup label="EMAIL ADDRESS" name="email" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="jane@company.com"
          />
        </UFormGroup>

        <UFormGroup label="PASSWORD" name="password" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="At least 8 characters"
          />
        </UFormGroup>

        <!-- New Organisation Mode Fields -->
        <template v-if="state.mode === 'new'">
          <UFormGroup label="ORGANISATION NAME" name="org.name" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput
              v-model="state.org.name"
              placeholder="Acme Corp"
            />
          </UFormGroup>

          <UFormGroup label="ORGANISATION LOGO URL (OPTIONAL)" name="org.logo" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput
              v-model="state.org.logo"
              placeholder="https://example.com/logo.png"
            />
          </UFormGroup>

          <UFormGroup label="ORGANISATION DESCRIPTION (OPTIONAL)" name="org.description" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UTextarea
              v-model="state.org.description"
              placeholder="Production Uptime & Monitoring Workspace"
              rows="2"
            />
          </UFormGroup>
        </template>

        <!-- Join Existing Organisation Mode Fields -->
        <template v-else>
          <UFormGroup label="ORGANISATION IDENTIFIER (OID)" name="oid" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput
              v-model="state.oid"
              placeholder="e.g. acme-x9k2p"
            />
          </UFormGroup>
        </template>

        <div class="pt-2">
          <UButton
            type="submit"
            block
            color="white"
            variant="solid"
            :loading="loading"
            class="bg-zinc-100 hover:bg-white text-zinc-950 font-bold gap-2 py-3 shadow-lg justify-center flex items-center"
          >
            Create Account <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Navigation link to login -->
    <div class="text-center text-xs text-zinc-400">
      Already have an account?
      <NuxtLink to="/login" class="text-zinc-100 hover:underline font-semibold ml-1">
        Sign in
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
import { signupSchema } from '~/utils/schemas/auth';
import { useAuthStore } from '~/stores/auth';
import { useApiClient } from '~/composables/useApiClient';

definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();
const api = useApiClient();
const toast = useToast();

const loading = ref(false);
const activeTab = ref(0);

const tabItems = [
  { label: 'Create New Org', key: 'new' },
  { label: 'Join Existing Org', key: 'existing' },
];

const state = reactive({
  name: '',
  email: '',
  password: '',
  mode: 'new' as 'new' | 'existing',
  oid: '',
  org: {
    name: '',
    logo: '',
    description: '',
  },
});

const onTabChange = (index: number) => {
  state.mode = tabItems[index].key as 'new' | 'existing';
};

const onSubmit = async () => {
  loading.value = true;
  try {
    const payload =
      state.mode === 'existing'
        ? {
            name: state.name,
            email: state.email,
            password: state.password,
            oid: state.oid,
          }
        : {
            name: state.name,
            email: state.email,
            password: state.password,
            org: {
              name: state.org.name,
              logo: state.org.logo || undefined,
              description: state.org.description || undefined,
            },
          };

    const response = await api<any>('/auth/signup', {
      method: 'POST',
      body: payload,
    });

    authStore.setAuth({
      user: response.user,
      organisation: response.organisation,
      token: response.token,
    });

    toast.add({
      title: 'Registration Successful',
      description: `Welcome to BetterPulse, ${response.user.name}!`,
      color: 'green',
    });

    router.push('/');
  } catch (err: any) {
    toast.add({
      title: 'Registration Failed',
      description: err.message || 'Could not complete registration.',
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};
</script>
