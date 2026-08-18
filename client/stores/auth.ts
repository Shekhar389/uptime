import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(true);
  const user = ref<User | null>({
    id: 'usr-1',
    name: 'Dev Engineer',
    email: 'dev@example.com',
  });
  const team = ref<Team | null>({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Acme Corp',
  });
  const token = ref<string | null>('dev-token-default');

  function setAuth(payload: { user: User; team: Team; token?: string }) {
    isAuthenticated.value = true;
    user.value = payload.user;
    team.value = payload.team;
    if (payload.token) {
      token.value = payload.token;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth_token', payload.token);
      }
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('team_id', payload.team.id);
    }
  }

  function updateTeam(newTeam: Team) {
    team.value = newTeam;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('team_id', newTeam.id);
    }
  }

  function logout() {
    isAuthenticated.value = false;
    user.value = null;
    team.value = null;
    token.value = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('team_id');
    }
  }

  return {
    isAuthenticated,
    user,
    team,
    token,
    setAuth,
    updateTeam,
    logout,
  };
});
