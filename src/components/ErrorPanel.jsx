import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPanel({ error }) {
  return (
    <div className="flex-1 min-h-[360px] bg-neutral-950 p-4">
      <div className="flex items-start gap-2 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2.5">
        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
        <div className="text-xs text-red-300 leading-relaxed">
          <p className="font-medium text-red-300 mb-0.5">Invalid JSON</p>
          <p className="text-red-400/90">{error.message}</p>
          {error.location && (
            <p className="text-red-400/70 mt-1">
              Line {error.location.line}, column {error.location.col}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
