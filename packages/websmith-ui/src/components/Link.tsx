import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const linkVariants = cva(
  "text-primary underline-offset-4 hover:underline",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    />
  )
)
Link.displayName = "Link"

export { Link }