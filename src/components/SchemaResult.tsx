import React from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import ErrorPanel from "./ErrorPanel";
import PanelHeader from "./PanelHeader";
import type { SchemaResult as SchemaResultValue, ToolboxError } from "../types";

interface SchemaResultProps {
  result: SchemaResultValue | null;
  error: ToolboxError | null;
}

export default function SchemaResult({ result, error }: SchemaResultProps) {
  const errorCount = result?.errors.length || 0;

  return (
    <div className="flex flex-col border-t border-[#1a1e24]">
      <PanelHeader
        title="VALIDATION RESULT"
        meta={result && !error ? <span className={`text-xs ${result.valid ? "text-emerald-400" : "text-red-400"}`}>{result.valid ? "Valid" : `${errorCount} ${errorCount === 1 ? "error" : "errors"}`}</span> : null}
      />
      {error ? <ErrorPanel error={error} /> : !result ? (
        <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-neutral-600"><ShieldCheck className="h-4 w-4" />Paste your data and schema, then select Validate JSON.</div>
      ) : result.valid ? (
        <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-emerald-400"><CheckCircle2 className="h-5 w-5" />JSON data matches the schema</div>
      ) : (
        <div className="grid gap-2 bg-neutral-950/60 p-4 md:grid-cols-2">
          {result.errors.map((item, index) => (
            <article key={`${item.path}-${item.keyword}-${index}`} className="rounded-lg border border-red-500/20 bg-red-950/20 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="min-w-0">
                  <code className="block break-all text-xs font-semibold text-red-300">{item.path}</code>
                  <p className="mt-1 text-sm text-neutral-300">{item.message}</p>
                  <span className="mt-2 inline-block rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500">{item.keyword}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
