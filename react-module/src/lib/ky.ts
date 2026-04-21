import ky from 'ky';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 🔓 authApi: 로그인, 회원가입 등 '비인증' 혹은 '인증 관리' 자체를 위한 인스턴스
 */
export const authApi = ky.create({
  prefix: '/ptc/', 
  credentials: 'include',
  retry: 0,
});

/**
 * 🔐 api: 일반적인 데이터 요청을 위한 '인증 기반' 인스턴스
 */
export const api = ky.create({
  prefix: '/ptc/',
  credentials: 'include',
  retry: 0,
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        // 💡 401 에러(세션 만료) 발생 시 자동으로 리프레시 시도
        if (response && response.status === 401 && !options?.context?.retryAfterRefresh) {
          const { setAccessToken, logout } = useAuthStore.getState();

          try {
            // 1. 리프레시 API 호출 (쿠키 기반)
            const refreshRes = await authApi.post('api/auth/refresh');

            if (refreshRes.ok) {
              const { accessToken } = await refreshRes.json();
              
              // 2. Zustand 메모리에 토큰 복구 (필요한 경우 대비)
              setAccessToken(accessToken);

              console.log('[Auth] 세션 복구 성공, 재요청 중...');
              
              // 3. 💡 헤더 주입 없이 원래 요청을 그대로 재시도 (쿠키 기반 인증 가정)
              return api(request, {
                ...options,
                context: { ...options?.context, retryAfterRefresh: true }
              });
            }
          } catch (error) {
            console.error('[Auth] 자동 세션 복구 실패:', error);
            logout();
          }
        }

        return response;
      },
    ],
  },
});
