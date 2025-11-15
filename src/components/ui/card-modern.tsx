import * as React from "react"
import { cn } from "@/lib/utils"

interface CardModernProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "premium"
  hover?: boolean
  glow?: boolean
}

const CardModern = React.forwardRef<HTMLDivElement, CardModernProps>(
  ({ className, variant = "default", hover = true, glow = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-orange-50 border-orange-100",
      glass: "bg-orange-50/80 backdrop-blur-sm border-orange-100/50",
      gradient: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
      premium: "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300",
    }

    const hoverEffects = hover ? "" : ""
  const glowEffect = glow ? "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/20 before:via-blue-500/20 before:to-indigo-500/20 before:opacity-0 before:transition-opacity before:duration-300" : ""

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 shadow-lg transition-all duration-300",
          variants[variant],
          hoverEffects,
          glowEffect,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardModern.displayName = "CardModern"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-start gap-4 mb-4", className)} {...props}>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold text-gray-900 dark:text-white", className)}
      {...props}
    >
      {children}
    </h3>
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
      {...props}
    >
      {children}
    </p>
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("text-gray-700 dark:text-gray-300", className)} {...props}>
      {children}
    </div>
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 mt-6", className)}
      {...props}
    >
      {children}
    </div>
  )
})
CardFooter.displayName = "CardFooter"

export { CardModern, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }