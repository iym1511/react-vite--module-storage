import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@naver.com'); // 테스트용 기본값
  const [password, setPassword] = useState('admin');

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: () => authService.login({ email, password }),
    onSuccess: (data) => {
      if (data.user && data.accessToken) {
        login(data.user, data.accessToken);
        navigate('/', { replace: true });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const isLoading = loginMutation.isPending;
  const isError = loginMutation.isError;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">로그인</h1>
          <p className="text-muted-foreground text-sm">시스템에 접속하기 위해 정보를 입력하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {isError && (
            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '로그인'}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}
