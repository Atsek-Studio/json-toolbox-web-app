import React from "react";
import { Braces, Database, FileCode2 } from "lucide-react";
import type { WorkspaceTab } from "../types";

interface WorkspaceTabsProps {
  activeTab: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
}

const tabs = [
  { key: "json" as const, label: "JSON Toolbox", Icon: Braces },
  { key: "html" as const, label: "HTML Viewer", Icon: FileCode2 },
  { key: "sql" as const, label: "SQL Converter", Icon: Database },
];

export default function WorkspaceTabs({ activeTab, onChange }: WorkspaceTabsProps) {
  return (
    <nav className="flex border-b border-neutral-800 bg-neutral-900/40 px-5" aria-label="Workspace">
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-selected={active}
            role="tab"
            className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${active ? "text-teal-300" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-teal-400" />}
          </button>
        );
      })}
    </nav>
  );
}
