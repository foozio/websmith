import * as React from "react"
import { cn } from "../lib/utils"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: "default" | "destructive"
  size?: "default" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", size = "default", ...props }, ref) => {
    const base = "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    const sizeClass = size === "lg" ? "h-11" : "h-10"
    const variantClass = variant === "destructive" ? "border-red-500" : ""
    return (
      <input
        type={type}
        className={cn(sizeClass, base, variantClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }