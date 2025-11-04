import * as React from "react"
import { cn } from "../lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | string
  gap?: number | string
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid",
        `grid-cols-${cols}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    />
  )
)
Grid.displayName = "Grid"

export { Grid }