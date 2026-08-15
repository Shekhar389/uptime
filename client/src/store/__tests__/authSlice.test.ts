import { describe, it, expect } from 'vitest';
import authReducer, { setAuth, logout, AuthState } from '../slices/authSlice';

describe('Redux Toolkit Auth Slice', () => {
  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    team: null,
    token: null,
  };

  it('updates state on setAuth action', () => {
    const user = { id: 'usr-99', name: 'Alice', email: 'alice@example.com' };
    const team = { id: 'team-99', name: 'Dev Ops' };

    const nextState = authReducer(initialState, setAuth({ user, team, token: 'secret-token' }));

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user).toEqual(user);
    expect(nextState.team).toEqual(team);
    expect(nextState.token).toBe('secret-token');
  });

  it('resets state on logout action', () => {
    const loggedInState: AuthState = {
      isAuthenticated: true,
      user: { id: '1', name: 'Bob', email: 'bob@example.com' },
      team: { id: '1', name: 'Team' },
      token: 'tok',
    };

    const nextState = authReducer(loggedInState, logout());

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.team).toBeNull();
    expect(nextState.token).toBeNull();
  });
});
