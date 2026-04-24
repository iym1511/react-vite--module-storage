import { authApi } from '@/api/ky';
import { useAuthStore } from '../store/useAuthStore';

interface User {
  id?: string;
  email: string;
  name: string;
}

/**
 * 🔄 checkAuth: 앱 시작 시 세션을 복구합니다.
 */
export const checkAuth = async () => {
  const { login, logout, setInitializing } = useAuthStore.getState();

  try {
    const response = await authApi.post('api/auth/refresh').json<{ 
      accessToken: string; 
      user: User 
    }>();
    
    // 💡 응답 데이터 유효성 검사 강화
    if (response && response.accessToken && response.user) {
      console.log('[checkAuth] 인증 복구 성공:', response.user.email);
      login(response.user, response.accessToken);
    } else {
      // 데이터 형식이 맞지 않으면 비인증 상태로 간주
      console.warn('[checkAuth] 인증 응답 형식이 올바르지 않습니다.');
      logout();
    }
  } catch (error) {
    // 401 에러(토큰 만료) 등은 정상적인 비인증 케이스이므로 warn 처리
    console.warn('[checkAuth] 인증 복구 실패 (로그인 필요)');
    logout();
  } finally {
    // 반드시 초기화 상태를 해제하여 라우터가 보이게 합니다.
    setInitializing(false);
  }
};
