import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAuthToken, setTeamId } from '../../api/axios';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  team: Team | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true,
  user: { id: 'usr-1', name: 'Dev Engineer', email: 'dev@example.com' },
  team: { id: '00000000-0000-0000-0000-000000000001', name: 'Acme Corp' },
  token: 'dev-token-default',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; team: Team; token?: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.team = action.payload.team;
      if (action.payload.token) {
        state.token = action.payload.token;
        setAuthToken(action.payload.token);
      }
      setTeamId(action.payload.team.id);
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      state.team = action.payload;
      setTeamId(action.payload.id);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.team = null;
      state.token = null;
      setAuthToken(null);
      setTeamId(null);
    },
  },
});

export const { setAuth, updateTeam, logout } = authSlice.actions;
export default authSlice.reducer;
