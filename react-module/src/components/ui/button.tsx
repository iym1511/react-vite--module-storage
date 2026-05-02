import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/utils/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'primary' | 'dark' | 'secondary' | 'ghost' | 'link' | 'on-dark' | 'secondary-on-dark' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      primary: "bg-primary text-on-primary hover:bg-notion-primary-pressed active:bg-notion-primary-deep shadow-sm",
      dark: "bg-notion-ink-deep text-background hover:bg-notion-ink",
      secondary: "bg-transparent text-foreground border border-notion-hairline-strong hover:bg-notion-surface",
      ghost: "bg-transparent text-foreground hover:bg-notion-surface-soft",
      link: "bg-transparent text-notion-link-blue hover:text-notion-link-blue-pressed p-0 h-auto font-medium",
      'on-dark': "bg-white text-notion-navy hover:bg-notion-muted",
      'secondary-on-dark': "bg-transparent text-white border border-white/40 hover:bg-white/10",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    }

    const sizes = {
      default: "h-10 px-[18px] py-[10px]",
      sm: "h-9 px-3 text-xs",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          size !== 'link' && sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
