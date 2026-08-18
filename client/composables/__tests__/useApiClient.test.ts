import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useApiClient } from '../useApiClient';

describe('useApiClient Composable Seam', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('instantiates client wrapper cleanly', () => {
    const authStore = useAuthStore();
    authStore.setAuth({
      user: { id: 'usr-1', name: 'Dev', email: 'dev@example.com' },
      team: { id: 'team-uuid-123', name: 'Acme' },
      token: 'test-bearer-token',
    });

    const client = useApiClient();
    expect(client).toBeDefined();
    expect(typeof client).toBe('function');
  });
});
