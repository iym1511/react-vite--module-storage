import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 🔐 AuthGuard: 라우터 로더를 통과한 후, 런타임 중의 인증 상태 변화를 감시합니다.
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 💡 초기화가 완전히 끝난 상태에서만 실시간 리다이렉트 판단
    if (!isInitializing && !isAuthenticated) {
      console.log('[AuthGuard] 런타임 중 인증 손실 -> 리다이렉트');
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, isInitializing, navigate, location.pathname]);

  // App.tsx에서 이미 필터링되지만, 레이아웃 중첩을 대비한 안전 가드
  return isAuthenticated ? <>{children}</> : null;
};

/**
 * 🔓 GuestGuard
 */
export const GuestGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  return !isAuthenticated ? <>{children}</> : null;
};
