import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export { useTheme } from 'next-themes'

/**
 * next-themes의 ThemeProvider를 래핑한 컴포넌트입니다.
 * attribute="class" 설정을 통해 테일윈드의 다크모드(.dark 클래스)와 연동됩니다.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
            {children}
        </NextThemesProvider>
    )
}
