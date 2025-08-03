"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Fallback Label component if @radix-ui/react-label is not available
const LabelPrimitive = {
  Root: React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
  >(({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={className}
      {...props}
    />
  ))
}
LabelPrimitive.Root.displayName = "Label"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
