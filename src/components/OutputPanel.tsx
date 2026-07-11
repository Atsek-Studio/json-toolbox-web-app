import React from "react";
import { ArrowLeftRight, Check, Copy } from "lucide-react";
import CodeOutput from "./CodeOutput";
import ErrorPanel from "./ErrorPanel";
import IconButton from "./IconButton";
import JsonHighlight from "./JsonHighlight";
import PanelHeader from "./PanelHeader";
import type { ToolboxError } from "../types";

interface OutputPanelProps {
  output: string;
  error: ToolboxError | null;
  isValid: boolean;
  reduction: number | null;
  copied: boolean;
  outputType?: "json" | "code";
  onCopy: () => void | Promise<void>;
  onSwap: () => void;
}

export default function OutputPanel({
  output,
  error,
  isValid,
  reduction,
  copied,
  outputType = "json",
  onCopy,
  onSwap,
}: OutputPanelProps) {
  const meta = (
    <>
      {isValid && (
        <span className="inline-flex items-center gap-1 text-xs text-teal-400">
          <Check className="w-3 h-3" />
          valid
        </span>
      )}
      {reduction !== null && <span className="text-xs text-neutral-600">-{reduction}%</span>}
    </>
  );
  const canSwap = outputType === "json" && Boolean(output);

  return (
    <div className="flex flex-col">
      <PanelHeader title="OUTPUT" meta={meta}>
        <div className="flex items-center gap-1">
          <IconButton onClick={onSwap} disabled={!canSwap} title="Use output as new input">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton onClick={onCopy} disabled={!output} title="Copy output">
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
          </IconButton>
        </div>
      </PanelHeader>

      {error ? (
        <ErrorPanel error={error} />
      ) : outputType === "code" ? (
        <CodeOutput value={output} />
      ) : (
        <JsonHighlight value={output} />
      )}
    </div>
  );
}
