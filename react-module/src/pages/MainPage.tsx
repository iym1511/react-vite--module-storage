import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Layers, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/ky';

export default function MainPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 🔓 로그아웃 전용 authApi 사용 (인터셉터 없음)
      await authApi.post('api/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Home</h1>
          <p className="text-muted-foreground">환영합니다, {user?.name}님! 원하시는 메뉴를 선택하세요.</p>
        </div>

        <div className="grid gap-4">
          {/* 📝 인피니티 스크롤 테스트 페이지 이동 버튼 */}
          <button
            onClick={() => navigate('/infinite-test')}
            className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-muted hover:border-primary/50 group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="rounded-lg bg-primary/20 p-2 text-primary group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Infinite Scroll Test</p>
                <p className="text-xs text-muted-foreground">useInfiniteQuery 기능을 테스트합니다.</p>
              </div>
            </div>
          </button>

          {/* 대시보드 상세 이동 버튼 */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-muted hover:border-primary/50 group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="rounded-lg bg-secondary/20 p-2 text-secondary group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Dashboard Detail</p>
                <p className="text-xs text-muted-foreground">보호된 시스템 정보를 상세히 확인합니다.</p>
              </div>
            </div>
          </button>

          {/* 유저 정보 요약 */}
          <div className="rounded-xl bg-muted/20 p-4 border border-border">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">사용자 계정</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 shadow-lg shadow-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
