import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';

describe('Pinia Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const authStore = useAuthStore();
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user?.email).toBe('dev@example.com');
    expect(authStore.team?.name).toBe('Acme Corp');
  });

  it('updates state on setAuth action', () => {
    const authStore = useAuthStore();
    const user = { id: 'usr-99', name: 'Alice', email: 'alice@example.com' };
    const team = { id: 'team-99', name: 'Dev Ops' };

    authStore.setAuth({ user, team, token: 'secret-token' });

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual(user);
    expect(authStore.team).toEqual(team);
    expect(authStore.token).toBe('secret-token');
  });

  it('resets state on logout action', () => {
    const authStore = useAuthStore();
    authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.team).toBeNull();
    expect(authStore.token).toBeNull();
  });
});
