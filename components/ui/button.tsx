"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-[#08090f] hover:bg-white/90 shadow-[0_8px_30px_-8px_rgba(255,255,255,0.35)]",
        gradient:
          "text-white bg-[linear-gradient(110deg,#7c5cff,#6d4bff_40%,#22d3ee)] bg-[length:200%_100%] bg-[position:0%] hover:bg-[position:100%] shadow-[0_10px_40px_-10px_rgba(124,92,255,0.7)]",
        glass:
          "glass text-white hover:bg-white/[0.07] hover:border-white/20",
        ghost: "text-[var(--muted)] hover:text-white hover:bg-white/[0.05]",
        whatsapp:
          "bg-[#25D366] text-[#06210f] font-semibold hover:bg-[#22c35e] shadow-[0_10px_40px_-10px_rgba(37,211,102,0.7)]",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-[15px] py-3.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "gradient",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
