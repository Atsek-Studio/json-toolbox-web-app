import React from "react";
import type { ButtonHTMLAttributes } from "react";

export default function IconButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`p-1.5 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
