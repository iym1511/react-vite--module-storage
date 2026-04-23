import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/ky';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('admin@naver.com'); // 테스트용 기본값
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await authApi.post('api/auth/login', {
        json: { email, password },
      }).json<{ message: string; accessToken: string; user: User }>();

      if (loginResponse.user && loginResponse.accessToken) {
        login(loginResponse.user, loginResponse.accessToken); 
        navigate('/', { replace: true }); 
      }
    } catch (err: any) {
      console.error('로그인 처리 중 에러 발생:', err);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

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

          {error && (
            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              {error}
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
