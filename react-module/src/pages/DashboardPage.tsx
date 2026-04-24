import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-white font-sans">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-card p-10 shadow-2xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/15 text-primary">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard Detail</h1>
              <p className="text-sm text-muted-foreground">보호된 시스템 데이터 센터</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/30 transition-all border border-secondary/20"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-muted/30 p-6 border border-border/40 space-y-4">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground text-opacity-90">사용자 프로필</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">성함</p>
                <p className="text-foreground text-sm font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">이메일</p>
                <p className="text-foreground text-sm font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-primary/5 p-6 border border-primary/10 space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-opacity-90">시스템 상태</h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm text-foreground">인증 토큰: <span className="text-green-500 font-mono">Valid</span></p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              본 페이지는 서버 사이드에서 토큰 검증이 완료된 사용자에게만 공개되는 안전한 영역입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
