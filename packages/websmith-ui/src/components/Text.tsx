import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const textVariants = cva(
  "leading-7",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "base",
      weight: "normal",
    },
  }
)

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div"
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, as: Component = "p", ...props }, ref) => {
    const Comp = Component
    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ size, weight }), className)}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text }