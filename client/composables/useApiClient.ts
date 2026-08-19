import { $fetch } from 'ofetch';
import { useAuthStore } from '~/stores/auth';

export function useApiClient() {
  const authStore = useAuthStore();
  const fetchInstance = globalThis.$fetch || $fetch;
  let apiBase = 'http://localhost:3001/api/v1';

  try {
    const config = useRuntimeConfig();
    if (config?.public?.apiBase) {
      apiBase = config.public.apiBase;
    }
  } catch {
    if (import.meta.env.VITE_API_BASE_URL) {
      apiBase = import.meta.env.VITE_API_BASE_URL;
    }
  }

  const client = fetchInstance.create({
    baseURL: apiBase,
    onRequest({ options }) {
      const headers = new Headers(options.headers || {});
      const token =
        authStore.token ||
        (typeof window !== 'undefined' && window.localStorage
          ? localStorage.getItem('auth_token')
          : null) ||
        'dev-token-default';
      const teamId =
        authStore.team?.id ||
        (typeof window !== 'undefined' && window.localStorage
          ? localStorage.getItem('team_id')
          : null) ||
        '00000000-0000-0000-0000-000000000001';

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (teamId) {
        headers.set('X-Team-ID', teamId);
      }
      options.headers = headers;
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        console.warn('Unauthorized access detected, redirecting to login seam');
      }
      const errorMessage =
        response._data?.message ||
        response._data?.error ||
        response.statusText ||
        'An unexpected network error occurred';
      throw new Error(errorMessage);
    },
  });

  return client;
}
