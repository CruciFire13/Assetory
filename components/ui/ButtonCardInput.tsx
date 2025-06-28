"use client";

import { Label } from "@radix-ui/react-label";
import clsx from "clsx";

interface ButtonCardInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function ButtonCardInput({
  label,
  type,
  ...props
}: ButtonCardInputProps) {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium text-white/80">{label}</Label>
      <input
        type={type}
        {...props}
        className={clsx(
          "w-full rounded-lg px-4 py-2 text-sm text-white bg-white/5 backdrop-blur-md shadow-inner",
          "placeholder:text-white/50 transition duration-200 border border-pink-500/30",

          "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",

          type === "file" &&
            "cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-pink-900/30 file:text-white file:transition file:hover:bg-pink-800/50"
        )}
      />
    </div>
  );
}
