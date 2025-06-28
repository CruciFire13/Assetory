import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-pink-500/20 bg-white/5 px-3 py-2 text-sm text-white/90 shadow-md backdrop-blur-md transition-colors duration-200",

        "placeholder:text-white/40 file:text-white/70 file:bg-transparent file:border-0 file:font-medium file:text-sm",

        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",

        "selection:bg-pink-500/70 selection:text-white",

        "disabled:opacity-50 disabled:cursor-not-allowed",

        "aria-invalid:ring-1 aria-invalid:ring-red-500/40",

        className
      )}
      {...props}
    />
  );
}

export { Input };
