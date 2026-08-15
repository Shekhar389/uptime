import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Default configuration for centralized API client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Helper getter/setter for active team context & auth token
let currentAuthToken: string | null = localStorage.getItem('auth_token') || 'dev-token-default';
let currentTeamId: string | null = localStorage.getItem('team_id') || '00000000-0000-0000-0000-000000000001';

export const setAuthToken = (token: string | null) => {
  currentAuthToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const setTeamId = (teamId: string | null) => {
  currentTeamId = teamId;
  if (teamId) {
    localStorage.setItem('team_id', teamId);
  } else {
    localStorage.removeItem('team_id');
  }
};

// Request Interceptor: Inject Auth Token and Active Team Header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (currentAuthToken) {
      config.headers.Authorization = `Bearer ${currentAuthToken}`;
    }
    if (currentTeamId) {
      config.headers['X-Team-ID'] = currentTeamId;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardized Error Handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    if (status === 401) {
      // Trigger token expiration logic or event if needed
      console.warn('Unauthorized access detected, redirecting to login seam');
    }

    return Promise.reject(new Error(errorMessage));
  }
);
