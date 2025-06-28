"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none ring-offset-background [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-pink-600 via-rose-500 to-red-500 text-white shadow-md hover:brightness-110 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-pink-400",
        destructive:
          "bg-red-700 text-white shadow-md hover:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-500",
        outline:
          "border border-pink-500/40 text-white bg-white/5 hover:bg-pink-500/10 backdrop-blur-md",
        secondary:
          "bg-pink-800/40 text-white shadow-inner hover:bg-pink-700/40",
        ghost: "text-white hover:bg-white/10",
        link: "text-pink-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 px-3 py-1 rounded-md text-sm",
        lg: "h-11 px-6 text-base rounded-md",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
