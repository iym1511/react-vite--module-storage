import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { AUTH_ERROR_MESSAGES } from '@/lib/constants/error-messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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

  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
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
        message: error.response?.data?.message || AUTH_ERROR_MESSAGES.LOGIN_FAILED 
      });
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutate(values);
  };

  const isLoading = isLoginPending;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">로그인</CardTitle>
          <CardDescription>시스템에 접속하기 위해 정보를 입력하세요.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  이메일
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    error={!!errors.email}
                    {...register('email')}
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
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    error={!!errors.password}
                    {...register('password')}
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '로그인'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              회원가입하기
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
