import React from "react";
import type { ButtonHTMLAttributes } from "react";

export default function IconButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-md border border-transparent p-1.5 text-[#575f6b] transition-colors hover:border-[#2a3038] hover:bg-[#171b21] hover:text-[#edf0f3] disabled:opacity-30 disabled:hover:border-transparent disabled:hover:bg-transparent ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
