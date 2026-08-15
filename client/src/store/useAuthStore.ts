import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  team: { id: string; name: string } | null;
  setAuth: (user: { id: string; name: string; email: string }, team: { id: string; name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: { id: 'usr-1', name: 'Dev Engineer', email: 'dev@example.com' },
  team: { id: '00000000-0000-0000-0000-000000000001', name: 'Acme Corp' },
  setAuth: (user, team) => set({ isAuthenticated: true, user, team }),
  logout: () => set({ isAuthenticated: false, user: null, team: null }),
}));
