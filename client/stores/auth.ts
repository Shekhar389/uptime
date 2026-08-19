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
  const isAuthenticated = ref(false);
  const user = ref<User | null>(null);
  const organisation = ref<Organisation | null>(null);
  const team = ref<Team | null>(null);
  const token = ref<string | null>(null);

  function initFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem('auth_token');
      const storedOrgId = localStorage.getItem('organisation_id');
      const storedOrgName = localStorage.getItem('organisation_name');
      const storedUserData = localStorage.getItem('user_data');

      if (storedToken) {
        token.value = storedToken;
        isAuthenticated.value = true;
      }
      if (storedUserData) {
        try {
          user.value = JSON.parse(storedUserData);
        } catch {
          user.value = null;
        }
      }
      if (storedOrgId) {
        const orgObj = { id: storedOrgId, name: storedOrgName || 'Organisation' };
        organisation.value = orgObj;
        team.value = { id: storedOrgId, name: storedOrgName || 'Organisation' };
      }
    }
  }

  initFromStorage();

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

    if (typeof window !== 'undefined' && window.localStorage) {
      if (payload.token) {
        token.value = payload.token;
        localStorage.setItem('auth_token', payload.token);
      }
      if (payload.user) {
        localStorage.setItem('user_data', JSON.stringify(payload.user));
      }
      if (org) {
        localStorage.setItem('organisation_id', org.id);
        localStorage.setItem('organisation_name', org.name);
        localStorage.setItem('team_id', org.id);
      }
    }
  }

  function updateOrganisation(newOrg: Organisation) {
    organisation.value = newOrg;
    team.value = { id: newOrg.id, name: newOrg.name };
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('organisation_id', newOrg.id);
      localStorage.setItem('organisation_name', newOrg.name);
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
      localStorage.removeItem('organisation_name');
      localStorage.removeItem('team_id');
      localStorage.removeItem('user_data');
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
