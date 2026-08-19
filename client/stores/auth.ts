import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Organisation {
  id: string;
  name: string;
  oid?: string | null;
  logo?: string | null;
  description?: string | null;
  status?: string;
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
  const organisation = ref<Organisation | null>({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Acme Corp',
    oid: 'acme-corp',
  });
  const team = ref<Team | null>({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Acme Corp',
  });
  const token = ref<string | null>('dev-token-default');

  function setAuth(payload: {
    user: User;
    organisation?: Organisation;
    team?: Team;
    token?: string;
  }) {
    isAuthenticated.value = true;
    user.value = payload.user;

    const org = payload.organisation || (payload.team ? { id: payload.team.id, name: payload.team.name } : null);
    organisation.value = org;
    team.value = org ? { id: org.id, name: org.name } : null;

    if (payload.token) {
      token.value = payload.token;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth_token', payload.token);
      }
    }
    if (org && typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('organisation_id', org.id);
      localStorage.setItem('team_id', org.id);
    }
  }

  function updateOrganisation(newOrg: Organisation) {
    organisation.value = newOrg;
    team.value = { id: newOrg.id, name: newOrg.name };
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('organisation_id', newOrg.id);
      localStorage.setItem('team_id', newOrg.id);
    }
  }

  function updateTeam(newTeam: Team) {
    updateOrganisation({ id: newTeam.id, name: newTeam.name });
  }

  function logout() {
    isAuthenticated.value = false;
    user.value = null;
    organisation.value = null;
    team.value = null;
    token.value = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('organisation_id');
      localStorage.removeItem('team_id');
    }
  }

  return {
    isAuthenticated,
    user,
    organisation,
    team,
    token,
    setAuth,
    updateOrganisation,
    updateTeam,
    logout,
  };
});
