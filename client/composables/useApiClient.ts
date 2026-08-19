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
          : null);
      const orgId =
        authStore.organisation?.id ||
        authStore.team?.id ||
        (typeof window !== 'undefined' && window.localStorage
          ? localStorage.getItem('organisation_id') || localStorage.getItem('team_id')
          : null);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (orgId) {
        headers.set('X-Organisation-ID', orgId);
        headers.set('X-Team-ID', orgId);
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
