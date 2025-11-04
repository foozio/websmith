import * as React from "react"
import { cn } from "../lib/utils"

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string
  direction?: "row" | "col"
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = 4, direction = "col", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        `gap-${gap}`,
        className
      )}
      {...props}
    />
  )
)
Stack.displayName = "Stack"

export { Stack }