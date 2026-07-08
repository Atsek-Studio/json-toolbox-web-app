import React from "react";
import { FileJson2 } from "lucide-react";
import { formatBytes } from "../utils/jsonTools.js";

export default function Header({ inputBytes, outputBytes, lastAction, hasError }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/60">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
          <FileJson2 className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-neutral-100 leading-tight">JSON Toolbox</h1>
          <p className="text-xs text-neutral-500 leading-tight">Beautify, minify, stringify and explore JSON</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span className="hidden sm:inline">{formatBytes(inputBytes)} in</span>
        {lastAction && (
          <>
            <span className="text-neutral-700">to</span>
            <span className={hasError ? "text-red-400" : "text-teal-400"}>
              {hasError ? "error" : formatBytes(outputBytes)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
