import React from "react";
import { ArrowRight, Database, FileCode2, FileJson2 } from "lucide-react";
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
    <header className="flex items-center justify-between gap-4 border-b border-[#1a1e24] px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border border-[#2a3038] bg-gradient-to-br from-[#1c2129] to-[#14171c] shadow-inner">
          <HeaderIcon className="h-[18px] w-[18px] text-[#60a5fa]" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-semibold leading-tight tracking-tight text-[#edf0f3]">{isHtml ? "HTML Viewer" : isSql ? "SQL Converter" : "JSON Toolbox"}</h1>
          <p className="mt-0.5 hidden truncate text-[12.5px] leading-tight text-[#575f6b] sm:block">{isHtml ? "Write HTML and inspect the live result" : isSql ? "Turn CREATE TABLE into application models" : "Format, convert, validate and compare JSON"}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-[#98a1af] sm:text-xs">
        <span className="rounded-md border border-[#2a3038] bg-[#171b21] px-2 py-1">{formatBytes(inputBytes)} <span className="hidden sm:inline">{isHtml ? "HTML" : isSql ? "SQL" : "in"}</span></span>
        {!isHtml && !isSql && lastAction && (
          <>
            <ArrowRight className="h-3.5 w-3.5 text-[#575f6b]" />
            <span className={`rounded-md border bg-[#171b21] px-2 py-1 ${hasError ? "border-red-900/60 text-red-400" : "border-[#294c73] text-[#60a5fa]"}`}>
              {hasError ? "error" : lastAction === "diff" ? `${diffCount} changes` : lastAction === "schema" ? "validator" : formatBytes(outputBytes)}
            </span>
          </>
        )}
      </div>
    </header>
  );
}
