import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

/**
 * 테마 전환을 담당하는 토글 버튼 컴포넌트입니다.
 * Lucide React 아이콘을 사용하여 시각적으로 표현합니다.
 */
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Toggle theme"
        >
            <Sun
                className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${isDark ? 'dark:-rotate-90 dark:scale-0' : ''}`}
            />
            <Moon
                className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${isDark ? 'dark:rotate-0 dark:scale-100' : ''}`}
            />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
