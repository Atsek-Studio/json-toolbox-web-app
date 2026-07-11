import React from "react";
import { Database, FileCode2, FileJson2 } from "lucide-react";
import { formatBytes } from "../utils/jsonTools";
import type { ToolboxAction, WorkspaceTab } from "../types";

interface HeaderProps {
  inputBytes: number;
  outputBytes: number;
  lastAction: ToolboxAction | null;
  hasError: boolean;
  diffCount?: number | null;
  workspace: WorkspaceTab;
}

export default function Header({ inputBytes, outputBytes, lastAction, hasError, diffCount = null, workspace }: HeaderProps) {
  const isHtml = workspace === "html";
  const isSql = workspace === "sql";
  const HeaderIcon = isHtml ? FileCode2 : isSql ? Database : FileJson2;
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/60">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
          <HeaderIcon className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-neutral-100 leading-tight">{isHtml ? "HTML Viewer" : isSql ? "SQL Converter" : "JSON Toolbox"}</h1>
          <p className="text-xs text-neutral-500 leading-tight">{isHtml ? "Write HTML and inspect the live result" : isSql ? "Turn CREATE TABLE into application models" : "Format, convert, validate and compare JSON"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span className="hidden sm:inline">{formatBytes(inputBytes)} {isHtml ? "HTML" : isSql ? "SQL" : "in"}</span>
        {!isHtml && !isSql && lastAction && (
          <>
            <span className="text-neutral-700">to</span>
            <span className={hasError ? "text-red-400" : "text-teal-400"}>
              {hasError ? "error" : lastAction === "diff" ? `${diffCount} changes` : lastAction === "schema" ? "validator" : formatBytes(outputBytes)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
