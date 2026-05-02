import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/features/auth/schemas/auth.schema';
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { AUTH_ERROR_MESSAGES } from '@/lib/constants/error-messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: (values: SignupFormValues) => authService.signup(values),
    onSuccess: () => {
      navigate('/login', { state: { message: '회원가입이 완료되었습니다. 로그인해 주세요.' } });
    },
    onError: (error: any) => {
      setError('root', { 
        message: error.response?.data?.message || AUTH_ERROR_MESSAGES.SIGNUP_FAILED 
      });
    }
  });

  const onSubmit = (values: SignupFormValues) => {
    registerMutate(values);
  };

  const isLoading = isRegisterPending;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">회원가입</CardTitle>
          <CardDescription>새로운 계정을 만들고 서비스를 시작하세요.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* 이름 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    className="pl-10"
                    error={!!errors.name}
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* 이메일 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  이메일
                </label>
                <div className="relative">
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
                <div className="relative">
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

              {/* 비밀번호 확인 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    error={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[0.8rem] font-medium text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* 전역 에러 */}
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
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '회원가입'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              로그인하기
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
