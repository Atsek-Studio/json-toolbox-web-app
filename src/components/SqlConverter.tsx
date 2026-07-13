import React from "react";
import { Check, Copy, Database, Play, Trash2 } from "lucide-react";
import type { FieldNameFormat, SqlConvertTarget, SqlDialect, ToolboxError } from "../types";
import CodeOutput from "./CodeOutput";
import ErrorPanel from "./ErrorPanel";
import PanelHeader from "./PanelHeader";

interface SqlConverterProps {
  input: string;
  onInputChange: (value: string) => void;
  dialect: SqlDialect;
  onDialectChange: (dialect: SqlDialect) => void;
  fieldNameFormat: FieldNameFormat;
  onFieldNameFormatChange: (format: FieldNameFormat) => void;
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

export default function SqlConverter({ input, onInputChange, dialect, onDialectChange, fieldNameFormat, onFieldNameFormatChange, target, onTargetChange, output, error, copied, onConvert, onCopy, onClear }: SqlConverterProps) {
  return (
    <>
      <div className="surface-bar flex flex-wrap items-end gap-3 border-b border-[#1a1e24] px-4 py-3 sm:px-5 sm:py-4">
        <label className="flex min-w-36 flex-1 flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-[#575f6b] sm:max-w-48">
          Dialect
          <select value={dialect} onChange={(event) => onDialectChange(event.target.value as SqlDialect)} className="control-surface h-8 rounded-[7px] border px-2.5 text-xs normal-case tracking-normal text-[#edf0f3] outline-none focus:border-[#60a5fa]">
            <option value="sqlserver">SQL Server</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="oracle">Oracle</option>
          </select>
        </label>
        <label className="flex min-w-44 flex-1 flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-[#575f6b] sm:max-w-60">
          Field naming
          <select value={fieldNameFormat} onChange={(event) => onFieldNameFormatChange(event.target.value as FieldNameFormat)} className="control-surface h-8 rounded-[7px] border px-2.5 text-xs normal-case tracking-normal text-[#edf0f3] outline-none focus:border-[#60a5fa]">
            <option value="language-default">Language default</option>
            <option value="camel">camelCase</option>
            <option value="pascal">PascalCase</option>
            <option value="snake">snake_case</option>
          </select>
        </label>
        <div className="control-surface flex flex-wrap gap-1 rounded-[10px] border p-1">
          <span className="inline-flex items-center gap-1.5 px-2 text-xs text-[#575f6b]"><Database className="h-3.5 w-3.5" />Output</span>
          {targets.map((option) => (
            <button key={option.key} onClick={() => onTargetChange(option.key)} className={`rounded-[7px] border px-3 py-1.5 text-xs font-medium transition-colors ${target === option.key ? "border-[#294c73] bg-[#60a5fa]/15 text-[#60a5fa]" : "border-transparent text-[#98a1af] hover:bg-[#171b21] hover:text-[#edf0f3]"}`}>{option.label}</button>
          ))}
        </div>
        <button onClick={() => onConvert()} className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-[#294c73] bg-[#60a5fa]/15 px-3 text-xs font-semibold text-[#60a5fa] transition-colors hover:bg-[#60a5fa]/20"><Play className="h-3.5 w-3.5" />Convert SQL</button>
        <div className="flex-1" />
        <button onClick={onClear} className="inline-flex h-9 items-center gap-1.5 rounded-[7px] px-2.5 text-xs text-[#575f6b] hover:bg-[#171b21] hover:text-[#edf0f3]"><Trash2 className="h-3.5 w-3.5" />Clear</button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#1a1e24] md:grid-cols-2 md:divide-x md:divide-y-0">
        <section className="flex min-w-0 flex-col">
          <PanelHeader title="CREATE TABLE"><span className="font-mono text-xs text-[#98a1af]">{input.length} chars</span></PanelHeader>
          <div className="editor-surface relative min-h-[520px] flex-1">
            {!input && <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[13px] text-neutral-700">Paste a CREATE TABLE statement here...</div>}
            <textarea value={input} onChange={(event) => onInputChange(event.target.value)} spellCheck={false} aria-label="SQL CREATE TABLE input" className="editor-scrollbar relative z-10 h-full min-h-[520px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-[1.75] text-[#edf0f3] outline-none selection:bg-[#60a5fa]/25 focus:ring-1 focus:ring-inset focus:ring-[#60a5fa]/30 sm:p-5" />
          </div>
        </section>

        <section className="flex min-w-0 flex-col">
          <PanelHeader title={targets.find((option) => option.key === target)?.label.toUpperCase() ?? "OUTPUT"} meta={output && !error ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400"><Check className="h-3 w-3" />Generated</span> : null}>
            <button onClick={onCopy} disabled={!output} className="rounded-md border border-transparent p-1.5 text-[#575f6b] transition-colors hover:border-[#2a3038] hover:bg-[#171b21] hover:text-[#edf0f3] disabled:opacity-30" title="Copy generated output">{copied ? <Check className="h-3.5 w-3.5 text-[#60a5fa]" /> : <Copy className="h-3.5 w-3.5" />}</button>
          </PanelHeader>
          {error ? <ErrorPanel error={error} /> : <CodeOutput value={output} />}
        </section>
      </div>
    </>
  );
}
