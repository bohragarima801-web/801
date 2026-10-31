"use client";

import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex min-h-[44px] h-11 w-full rounded-xl border border-[#E8DDD0] bg-white px-3.5 py-2 text-sm text-[#241A18] font-medium shadow-xs transition-all duration-200 placeholder:text-[#6F625D]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F2B]/20 focus-visible:border-[#7A1F2B] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
