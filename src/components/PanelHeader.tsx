import React from "react";
import type { ReactNode } from "react";

interface PanelHeaderProps {
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}

export default function PanelHeader({ title, meta, children }: PanelHeaderProps) {
  return (
    <div className="flex min-h-[45px] items-center justify-between gap-3 border-b border-[#1a1e24] bg-[#12151a] px-4 py-2.5 sm:px-5">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-[#575f6b]">{title}</span>
        {meta}
      </div>
      {children}
    </div>
  );
}
