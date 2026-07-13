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
    <nav className="editor-scrollbar flex overflow-x-auto border-b border-[#1a1e24] px-3 pt-2 sm:px-5" aria-label="Workspace">
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-selected={active}
            role="tab"
            className={`relative inline-flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${active ? "text-[#edf0f3]" : "text-[#98a1af] hover:text-[#edf0f3]"}`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-[#60a5fa]" : "opacity-70"}`} />
            {label}
            {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[#60a5fa] to-transparent" />}
          </button>
        );
      })}
    </nav>
  );
}
