import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/utils'

interface LoadingProps {
    fullScreen?: boolean
    text?: string
    className?: string
}

export function Loading({ fullScreen = false, text = 'Loading workspace...', className }: LoadingProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4',
                fullScreen ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'min-h-[200px] w-full',
                className
            )}
        >
            <div className="relative flex items-center justify-center">
                {/* 🌀 Notion Signature Purple Spinner */}
                <Loader2 className="h-10 w-10 animate-spin text-notion-primary" />
                
                {/* 💡 Optional: Subtle brand mark in the center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-notion-primary/40" />
                </div>
            </div>

            {text && (
                <p className="animate-pulse text-sm font-medium tracking-tight text-notion-slate dark:text-notion-stone">
                    {text}
                </p>
            )}
        </div>
    )
}

export function LoadingSpinner({ className }: { className?: string }) {
    return <Loader2 className={cn('h-4 w-4 animate-spin text-notion-primary', className)} />
}
