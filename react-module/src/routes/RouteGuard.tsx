import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

interface RouteGuardProps {
  type: 'auth' | 'guest';
}

/**
 * 🛡️ RouteGuard: 로더가 입구(진입)를 지킨다면, 
 * 이 컴포넌트는 페이지 '안'에서의 인증 상태 변화를 감시하거나 
 * 레이아웃의 일관성을 유지하는 역할을 합니다.
 */
export default function RouteGuard({ type }: RouteGuardProps) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const navigate = useNavigate();

  console.log('isAuthenticated', isAuthenticated);
  console.log('isInitializing', isInitializing);

  useEffect(() => {
    // 💡 로더가 이미 선제적으로 차단하지만, 
    // 사용자가 페이지 체류 중 로그아웃을 하는 등 '런타임' 상태 변화를 감시합니다.
    if (!isInitializing) {
      if (type === 'auth' && !isAuthenticated) {
        // 로그인 페이지로 리다이렉팅
        navigate('/login', { replace: true });
      }
      if (type === 'guest' && isAuthenticated) {
        // 메인페이지로 리다이렉팅
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isInitializing, type, navigate]);

  // ⏳ 초기화 중이거나 권한이 맞지 않을 때 찰나의 순간에 
  // 잘못된 UI가 노출되지 않도록 방어합니다.
  if (isInitializing) return <div>로딩중입니다.</div>;

  if (type === 'auth' && !isAuthenticated) return null;
  if (type === 'guest' && isAuthenticated) return null;

  return <Outlet />;
}
