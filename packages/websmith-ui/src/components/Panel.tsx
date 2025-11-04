import * as React from "react"
import { cn } from "../lib/utils"

const Panel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border bg-background p-4 shadow-sm",
      className
    )}
    {...props}
  />
))
Panel.displayName = "Panel"

export { Panel }