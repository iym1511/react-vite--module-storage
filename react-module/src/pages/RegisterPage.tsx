import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/api/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormValues } from '@/features/auth/schemas/auth.schema'
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const registerMutation = useMutation({
        mutationFn: (values: SignupFormValues) => authService.signup(values),
        onSuccess: () => {
            // 💡 실제 실무라면 성공 페이지로 보내거나 토스트 메시지를 띄움
            navigate('/login', { state: { message: '회원가입이 완료되었습니다. 로그인해 주세요.' } })
        },
        onError: (error: any) => {
            setError('root', {
                message: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
            })
        },
    })

    const onSubmit = (values: SignupFormValues) => {
        registerMutation.mutate(values)
    }

    const isLoading = registerMutation.isPending

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border">
                <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">회원가입</h1>
                    <p className="text-muted-foreground text-sm">새로운 계정을 만들고 서비스를 시작하세요.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        {/* 이름 입력 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                이름
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="홍길동"
                                    {...register('name')}
                                    className={`flex h-10 w-full rounded-md border bg-muted/30 px-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                        errors.name ? 'border-destructive' : 'border-input'
                                    }`}
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
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                    className={`flex h-10 w-full rounded-md border bg-muted/30 px-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                        errors.email ? 'border-destructive' : 'border-input'
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
                                    className={`flex h-10 w-full rounded-md border bg-muted/30 px-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                        errors.password ? 'border-destructive' : 'border-input'
                                    }`}
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
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                    className={`flex h-10 w-full rounded-md border bg-muted/30 px-10 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                        errors.confirmPassword ? 'border-destructive' : 'border-input'
                                    }`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-[0.8rem] font-medium text-destructive">
                                    {errors.confirmPassword.message}
                                </p>
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '회원가입'}
                    </button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        로그인하기
                    </Link>
                </div>
            </div>
        </div>
    )
}
