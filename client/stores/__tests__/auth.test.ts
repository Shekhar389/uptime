import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';

describe('Pinia Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const authStore = useAuthStore();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.organisation).toBeNull();
    expect(authStore.team).toBeNull();
    expect(authStore.token).toBeNull();
  });

  it('updates state on setAuth action with organisation', () => {
    const authStore = useAuthStore();
    const user = { id: 'usr-99', name: 'Alice', email: 'alice@example.com' };
    const organisation = { id: 'org-99', name: 'Acme Corp', oid: 'acme-99' };

    authStore.setAuth({ user, organisation, token: 'secret-token' });

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(user);
    expect(authStore.organisation).toEqual(organisation);
    expect(authStore.token).toBe('secret-token');
  });

  it('resets state on logout action', () => {
    const authStore = useAuthStore();
    authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.organisation).toBeNull();
    expect(authStore.token).toBeNull();
  });
});
