import { httpClient } from './httpClient';
import type { LoginRequest, LoginResponse, UserInfo } from '../types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    httpClient.post<LoginResponse>('/api/auth/login', data, { skipAuth: true }),

  getMe: () =>
    httpClient.get<UserInfo>('/api/auth/me'),
};
