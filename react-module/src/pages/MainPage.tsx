import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon, Layers, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/lib/theme-provider'
import { authApi } from '@/lib/ky'
import { cn } from '@/lib/utils'

export default function MainPage() {
    const { user, logout } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            // 🔓 로그아웃 전용 authApi 사용 (인터셉터 없음)
            await authApi.post('api/auth/logout')
        } catch (err) {
            console.error('Logout failed:', err)
        } finally {
            logout()
            navigate('/login', { replace: true })
        }
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className={cn('flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground')}>
            <div
                className={cn(
                    'relative w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-xl border border-border'
                )}
            >
                {/* 🌙 테마 토글 버튼 */}
                <button
                    onClick={toggleTheme}
                    className={cn(
                        'absolute right-6 top-6 rounded-full p-2 text-muted-foreground transition-colors',
                        'hover:bg-muted hover:text-foreground'
                    )}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <div className="text-center space-y-2">
                    <div
                        className={cn(
                            'inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary'
                        )}
                    >
                        <UserIcon className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Home</h1>
                    <p className="text-muted-foreground">환영합니다, {user?.name}님! 원하시는 메뉴를 선택하세요.</p>
                </div>

                <div className="grid gap-4">
                    {/* 📝 인피니티 스크롤 테스트 페이지 이동 버튼 */}
                    <button
                        onClick={() => navigate('/infinite-test')}
                        className={cn(
                            'flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all group',
                            'hover:bg-muted hover:border-primary/50'
                        )}
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div
                                className={cn(
                                    'rounded-lg bg-primary/20 p-2 text-primary transition-transform',
                                    'group-hover:scale-110'
                                )}
                            >
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
                        className={cn(
                            'flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all group',
                            'hover:bg-muted hover:border-primary/50'
                        )}
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div
                                className={cn(
                                    'rounded-lg bg-secondary/20 p-2 text-secondary transition-transform',
                                    'group-hover:scale-110'
                                )}
                            >
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
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                사용자 계정
                            </p>
                            <p className="font-medium text-foreground">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* 로그아웃 버튼 */}
                <button
                    onClick={handleLogout}
                    className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition-all shadow-lg shadow-destructive/20',
                        'hover:bg-destructive/90'
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                </button>
            </div>
        </div>
    )
}
