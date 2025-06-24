"use client";

import { Label } from "@radix-ui/react-label";

interface ButtonCardInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function ButtonCardInput({
  label,
  ...props
}: ButtonCardInputProps) {
  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium">{label}</Label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}
