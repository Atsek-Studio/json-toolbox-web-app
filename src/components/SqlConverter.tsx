import React from "react";
import { Check, Copy, Database, Play, Trash2 } from "lucide-react";
import type { SqlConvertTarget, ToolboxError } from "../types";
import CodeOutput from "./CodeOutput";
import ErrorPanel from "./ErrorPanel";
import PanelHeader from "./PanelHeader";

interface SqlConverterProps {
  input: string;
  onInputChange: (value: string) => void;
  target: SqlConvertTarget;
  onTargetChange: (target: SqlConvertTarget) => void;
  output: string;
  error: ToolboxError | null;
  copied: boolean;
  onConvert: () => void;
  onCopy: () => void | Promise<void>;
  onClear: () => void;
}

const targets: { key: SqlConvertTarget; label: string }[] = [
  { key: "csharp-entity", label: "C# EF Entity" },
  { key: "csharp-model", label: "C# Model" },
  { key: "typescript-dto", label: "TypeScript DTO" },
  { key: "dart", label: "Dart Model" },
];

export default function SqlConverter({ input, onInputChange, target, onTargetChange, output, error, copied, onConvert, onCopy, onClear }: SqlConverterProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 bg-neutral-900/30 px-5 py-3">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs text-neutral-500"><Database className="h-3.5 w-3.5" />Output</span>
        {targets.map((option) => (
          <button key={option.key} onClick={() => onTargetChange(option.key)} className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${target === option.key ? "border-teal-500 bg-teal-600 text-white" : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}>{option.label}</button>
        ))}
        <button onClick={() => onConvert()} className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-emerald-500 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"><Play className="h-3.5 w-3.5" />Convert SQL</button>
        <div className="flex-1" />
        <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"><Trash2 className="h-3.5 w-3.5" />Clear</button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-neutral-800 md:grid-cols-2 md:divide-x md:divide-y-0">
        <section className="flex min-w-0 flex-col">
          <PanelHeader title="CREATE TABLE"><span className="text-xs text-neutral-600">{input.length} chars</span></PanelHeader>
          <div className="editor-surface relative min-h-[520px] flex-1 bg-neutral-950">
            {!input && <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[13px] text-neutral-700">Paste a CREATE TABLE statement here...</div>}
            <textarea value={input} onChange={(event) => onInputChange(event.target.value)} spellCheck={false} aria-label="SQL CREATE TABLE input" className="editor-scrollbar relative z-10 h-full min-h-[520px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-neutral-200 outline-none selection:bg-teal-500/30 focus:ring-1 focus:ring-inset focus:ring-teal-500/30" />
          </div>
        </section>

        <section className="flex min-w-0 flex-col">
          <PanelHeader title={targets.find((option) => option.key === target)?.label.toUpperCase() ?? "OUTPUT"} meta={output && !error ? <span className="inline-flex items-center gap-1 text-xs text-teal-400"><Check className="h-3 w-3" />Generated</span> : null}>
            <button onClick={onCopy} disabled={!output} className="rounded p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-30" title="Copy generated output">{copied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}</button>
          </PanelHeader>
          {error ? <ErrorPanel error={error} /> : <CodeOutput value={output} />}
        </section>
      </div>
    </>
  );
}
