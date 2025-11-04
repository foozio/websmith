import * as React from "react"
import { cn } from "../lib/utils"

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
)
Divider.displayName = "Divider"

export { Divider }