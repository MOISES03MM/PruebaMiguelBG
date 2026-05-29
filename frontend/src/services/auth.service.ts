import { authApi } from '../api/auth.api';
import type { LoginRequest, LoginResponse, UserInfo } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return await authApi.login(credentials);
  },

  getMe: async (): Promise<UserInfo> => {
    return await authApi.getMe();
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
