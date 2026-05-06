import { useNavigate } from 'react-router-dom'
import { LogOut, Layers, LayoutDashboard, Sun, Moon, Sparkles, BookOpen, Rocket } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useTheme } from '@/components/providers/theme-provider'
import { cn } from '@/utils/utils'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/api/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MainPage() {
    const { user, logout } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()

    const { mutate: logoutMutate, isPending: isLogoutPending } = useMutation({
        mutationFn: authService.logout,
        onSettled: () => {
            logout()
            navigate('/login', { replace: true })
        },
    })

    const handleLogout = () => {
        logoutMutate()
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-notion-primary/30 transition-colors duration-200">
            {/* 🏗️ Sticky Top Navigation */}
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-notion-hairline bg-background/80 px-6 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-notion-ink text-background">
                        <span className="text-lg font-bold">N</span>
                    </div>
                    <span className="text-sm font-semibold tracking-tight">Notion Module</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-md"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={isLogoutPending}
                        className="text-sm font-medium"
                    >
                        {isLogoutPending ? '...' : <LogOut className="h-4 w-4" />}
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
                {/* 🎯 Hero Section */}
                <section className="mb-20 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-notion-hairline bg-notion-surface px-3 py-1 text-[13px] font-medium text-notion-steel">
                        <Sparkles className="h-3 w-3 text-notion-primary" />
                        <span>Welcome back to your workspace</span>
                    </div>
                    <h1 className="mb-6 text-5xl font-semibold leading-[1.1] tracking-[-1.5px] lg:text-7xl">
                        Meet the next shift, <br />
                        <span className="text-notion-primary">{user?.name}</span>.
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-notion-slate lg:text-xl">
                        Write, plan, and get organized in one place. Your personalized module workspace is ready for action.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Button variant="primary" size="lg" className="rounded-md font-semibold">
                            Get started free
                        </Button>
                        <Button variant="secondary" size="lg" className="rounded-md font-semibold">
                            Request a demo
                        </Button>
                    </div>
                </section>

                {/* 📦 Feature Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card: Infinite Scroll */}
                    <Card 
                        className="group cursor-pointer overflow-hidden border-notion-hairline bg-card transition-all hover:shadow-lg"
                        onClick={() => navigate('/infinite-test')}
                    >
                        <div className="h-32 bg-notion-tint-sky p-6 dark:bg-notion-link-blue/20">
                            <Layers className="h-10 w-10 text-notion-link-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6">
                            <h3 className="mb-2 text-xl font-semibold">Infinite Scroll</h3>
                            <p className="text-sm text-notion-slate">
                                Test the useInfiniteQuery capabilities with seamless list loading.
                            </p>
                        </div>
                    </Card>

                    {/* Card: Dashboard */}
                    <Card 
                        className="group cursor-pointer overflow-hidden border-notion-hairline bg-card transition-all hover:shadow-lg"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="h-32 bg-notion-tint-rose p-6 dark:bg-notion-primary/20">
                            <LayoutDashboard className="h-10 w-10 text-notion-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6">
                            <h3 className="mb-2 text-xl font-semibold">Dashboard</h3>
                            <p className="text-sm text-notion-slate">
                                Access your protected system metrics and management tools.
                            </p>
                        </div>
                    </Card>

                    {/* Card: Placeholder / Community */}
                    <Card className="group border-notion-hairline bg-card transition-all hover:shadow-lg">
                        <div className="h-32 bg-notion-tint-peach p-6 dark:bg-notion-orange/20">
                            <BookOpen className="h-10 w-10 text-notion-orange group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6">
                            <h3 className="mb-2 text-xl font-semibold">Resources</h3>
                            <p className="text-sm text-notion-slate">
                                Explore documentation and community templates for your project.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* 📊 Bottom Section: User Info */}
                <section className="mt-20 flex flex-col items-center justify-between gap-8 rounded-xl border border-notion-hairline bg-notion-surface p-8 md:flex-row">
                    <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-notion-primary/10 text-notion-primary">
                            <Rocket className="h-8 w-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold">Currently logged in as</h4>
                            <p className="text-notion-slate">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="w-full md:w-auto">
                        Upgrade your plan
                    </Button>
                </section>
            </main>

            {/* 📝 Footer */}
            <footer className="border-t border-notion-hairline py-12 text-center text-sm text-notion-steel">
                <p>© 2026 Notion Module SPA. All rights reserved.</p>
            </footer>
        </div>
    )
}
