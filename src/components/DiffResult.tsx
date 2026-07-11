import React, { useMemo } from "react";
import { Check, Columns2 } from "lucide-react";
import ErrorPanel from "./ErrorPanel";
import { tokenizeJson, tokenClassName } from "./JsonHighlight";
import PanelHeader from "./PanelHeader";
import { createSplitDiff } from "../utils/splitDiff";
import type { DiffChange, ToolboxError } from "../types";

function HighlightedLine({ value, emphasis }: { value?: string; emphasis: string | null }) {
  if (value === undefined) return null;
  if (!emphasis) {
    return tokenizeJson(value).map((token, index) => (
      <span key={`${index}-${token.type}`} className={tokenClassName(token)}>{token.value}</span>
    ));
  }
  return <span className={emphasis}>{value || " "}</span>;
}

interface CodeCellProps {
  value?: string;
  lineNumber: number | null;
  side: "before" | "after";
  changed: boolean;
}

function CodeCell({ value, lineNumber, side, changed }: CodeCellProps) {
  const removed = side === "before";
  const background = changed
    ? removed ? "bg-red-950/55" : "bg-emerald-950/45"
    : "bg-neutral-950";
  const marker = changed ? (removed ? "−" : "+") : " ";
  const emphasis = changed
    ? removed ? "bg-red-500/25 text-red-200" : "bg-emerald-500/25 text-emerald-200"
    : null;

  return (
    <div className={`grid grid-cols-[44px_24px_minmax(max-content,1fr)] min-h-7 ${background}`}>
      <span className={`select-none border-r px-2 py-1 text-right text-xs ${changed ? removed ? "border-red-900/60 text-red-500" : "border-emerald-900/60 text-emerald-500" : "border-neutral-800 text-neutral-600"}`}>
        {value === undefined ? "" : lineNumber}
      </span>
      <span className={`select-none py-1 text-center ${changed ? removed ? "text-red-400" : "text-emerald-400" : "text-neutral-700"}`}>{value === undefined ? "" : marker}</span>
      <code className="whitespace-pre px-2 py-1 text-[13px] leading-5 text-neutral-300">
        <HighlightedLine value={value} emphasis={emphasis} />
      </code>
    </div>
  );
}

interface DiffResultProps {
  changes: DiffChange[];
  error: ToolboxError | null;
  hasCompared: boolean;
  beforeText: string;
  afterText: string;
}

export default function DiffResult({ changes, error, hasCompared, beforeText, afterText }: DiffResultProps) {
  const rows = useMemo(() => {
    if (error || !hasCompared) return [];
    const before = JSON.stringify(JSON.parse(beforeText), null, 2).split("\n");
    const after = JSON.stringify(JSON.parse(afterText), null, 2).split("\n");
    return createSplitDiff(before, after);
  }, [afterText, beforeText, error, hasCompared]);

  let beforeLine = 0;
  let afterLine = 0;

  return (
    <div className="flex flex-col border-t border-neutral-800">
      <PanelHeader title="DIFFERENCES" meta={!error && hasCompared ? <span className="inline-flex items-center gap-2 text-xs text-neutral-500"><Columns2 className="h-3.5 w-3.5" />Split view · {changes.length} {changes.length === 1 ? "change" : "changes"}</span> : null} />
      {error ? <ErrorPanel error={error} /> : hasCompared && changes.length === 0 ? (
        <div className="min-h-32 flex items-center justify-center gap-2 text-sm text-teal-400"><Check className="w-4 h-4" />The JSON values are identical</div>
      ) : !hasCompared ? (
        <div className="min-h-32 flex items-center justify-center text-sm text-neutral-600">Edit either document, then select Diff to compare.</div>
      ) : (
        <div className="editor-scrollbar overflow-auto border-t border-neutral-800 bg-neutral-950">
          <div className="grid min-w-[760px] grid-cols-2 divide-x divide-neutral-700">
            <div className="border-b border-neutral-700 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-400">Original</div>
            <div className="border-b border-neutral-700 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-400">Modified</div>
          </div>
          <div className="min-w-[760px]">
            {rows.map((row, index) => {
              const leftNumber = row.before === undefined ? null : ++beforeLine;
              const rightNumber = row.after === undefined ? null : ++afterLine;
              const changed = row.type !== "equal";
              return <div key={index} className="grid grid-cols-2 divide-x divide-neutral-700">
                <CodeCell value={row.before} lineNumber={leftNumber} side="before" changed={changed} />
                <CodeCell value={row.after} lineNumber={rightNumber} side="after" changed={changed} />
              </div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
