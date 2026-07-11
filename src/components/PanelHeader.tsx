import React from "react";
import type { ReactNode } from "react";

interface PanelHeaderProps {
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}

export default function PanelHeader({ title, meta, children }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/40">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 tracking-wide">{title}</span>
        {meta}
      </div>
      {children}
    </div>
  );
}
