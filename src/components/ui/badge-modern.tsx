import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full text-xs font-medium transition-all duration-200 px-2.5 py-0.5 border",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        premium:
          "border-transparent bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-400",
        gradient:
          "border-transparent bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900/20 dark:to-blue-900/20 dark:text-purple-400",
        modern:
          "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-700 dark:bg-orange-800/60 dark:text-orange-300 backdrop-blur-md",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-xs px-2 py-0.5",
        lg: "text-sm px-3 py-1",
        xl: "text-base px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
  dot?: boolean
}

function Badge({ className, variant, size, pulse = false, dot = false, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span className={cn(
          "w-2 h-2 rounded-full",
          pulse && "animate-pulse",
          variant === "success" && "bg-green-500",
          variant === "warning" && "bg-yellow-500",
          variant === "destructive" && "bg-red-500",
          variant === "premium" && "bg-gradient-to-r from-amber-500 to-orange-500",
          variant === "gradient" && "bg-gradient-to-r from-purple-500 to-blue-500",
          !variant || variant === "default" && "bg-primary",
          variant === "secondary" && "bg-secondary",
          variant === "modern" && "bg-gray-400 dark:bg-gray-500"
        )} />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }