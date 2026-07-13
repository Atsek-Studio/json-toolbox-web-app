import React from "react";
import { AlertTriangle } from "lucide-react";
import type { ToolboxError } from "../types";

export default function ErrorPanel({ error }: { error: ToolboxError }) {
  return (
    <div className="min-h-[480px] flex-1 bg-[#0d0f13] p-4 sm:p-5">
      <div className="flex items-start gap-2 rounded-[10px] border border-red-900/50 bg-red-950/30 px-3 py-2.5">
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
