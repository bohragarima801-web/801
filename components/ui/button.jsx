"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F2B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#7A1F2B] text-white shadow-sm hover:bg-[#52131D] hover:shadow-md",
        destructive:
          "bg-[#B42318] text-white shadow-sm hover:bg-[#901c13]",
        outline:
          "border border-[#7A1F2B] text-[#7A1F2B] bg-transparent hover:bg-[#FDF4F5]",
        secondary:
          "bg-[#FAF6ED] text-[#9A7528] border border-[#C89B3C]/40 hover:bg-[#F5ECCE]",
        ghost: "hover:bg-[#F7F0E6] text-[#241A18]",
        link: "text-[#7A1F2B] underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-[#7A1F2B] via-[#962B3B] to-[#7A1F2B] text-white border border-[#C89B3C]/40 shadow-sm hover:shadow-lg hover:border-[#C89B3C]",
      },
      size: {
        default: "min-h-[44px] h-11 px-5 py-2.5 rounded-xl text-sm",
        sm: "min-h-[36px] h-9 rounded-lg px-3.5 text-xs",
        lg: "min-h-[48px] h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
