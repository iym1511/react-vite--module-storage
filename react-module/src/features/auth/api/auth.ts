import { authApi, api } from '@/api/ky';
import { AUTH_ERROR_MESSAGES, SYSTEM_ERROR_MESSAGES } from '@/lib/constants/error-messages';

interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
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
  /**
   * 로그인
   */
  login: async ({ email, password }: LoginParams) => {
    try {
      return await authApi.post('api/auth/login', {
        json: { email, password },
      }).json<LoginResponse>();
    } catch (error) {
      console.error(`❌ ${AUTH_ERROR_MESSAGES.LOGIN_FAILED}`, error);
      throw error;
    }
  },

  /**
   * 회원가입
   */
  signup: async ({ name, email, password }: RegisterParams) => {
    try {
      return await authApi.post('api/auth/signup', {
        json: { name, email, password },
      });
    } catch (error) {
      console.error(`❌ ${AUTH_ERROR_MESSAGES.SIGNUP_FAILED}`, error);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      return await authApi.post('api/auth/logout');
    } catch (error) {
      console.error('❌ 로그아웃 요청 실패:', error);
      throw error;
    }
  },

  /**
   * 현재 사용자 정보 조회
   */
  me: async () => {
    try {
      return await api.get('api/auth/me').json<{ user: User }>();
    } catch (error) {
      // 💡 me API의 경우 인증되지 않은 상태에서 호출될 수 있으므로, 에러 성격에 따라 처리
      console.error(`❌ ${SYSTEM_ERROR_MESSAGES.SERVER_ERROR} (me API)`, error);
      throw error;
    }
  },
};
