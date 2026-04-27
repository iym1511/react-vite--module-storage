import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { API_ERROR_MESSAGES } from '@/lib/constants/error-messages';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 폼 초기화 (Zod 스키마 기반)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@naver.com',
      password: 'admin',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: (data) => {
      if (data.user && data.accessToken) {
        login(data.user, data.accessToken);
        navigate('/', { replace: true });
      }
    },
    onError: (error: any) => {
      // 💡 서버 에러가 올 경우 폼 필드에 에러 바인딩
      setError('root', { 
        message: error.response?.data?.message || API_ERROR_MESSAGES.LOGIN_FAILED 
      });
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const isLoading = loginMutation.isPending;

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`flex h-10 w-full rounded-md border bg-muted/30 px-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`flex h-10 w-full rounded-md border bg-muted/30 px-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.password ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[0.8rem] font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* 전역 에러 (서버 에러 등) */}
          {errors.root && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{errors.root.message}</p>
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
