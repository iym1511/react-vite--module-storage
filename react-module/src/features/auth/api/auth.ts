import { authApi } from '@/api/ky';

interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

/**
 * 🔐 인증 관련 API 서비스
 */
export const authService = {
  login: async ({ email, password }: LoginParams) => {
    return await authApi.post('api/auth/login', {
      json: { email, password },
    }).json<LoginResponse>();
  },

  signup: async ({ name, email, password }: RegisterParams) => {
    return await authApi.post('api/auth/signup', {
      json: { name, email, password },
    });
  },

  logout: async () => {
    return await authApi.post('api/auth/logout');
  },
};
