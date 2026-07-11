import React, { useRef } from "react";
import type { UIEvent } from "react";
import { tokenizeJson, tokenClassName } from "./JsonHighlight";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  const previewRef = useRef<HTMLPreElement>(null);

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (!previewRef.current) return;
    previewRef.current.scrollTop = event.currentTarget.scrollTop;
    previewRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  return (
    <div className="editor-surface relative flex-1 min-h-[360px] bg-neutral-950">
      {!value && (
        <div className="pointer-events-none absolute inset-0 p-4 text-[13px] leading-relaxed font-mono text-neutral-700">
          Paste your JSON here...
        </div>
      )}

      <pre
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 text-[13px] leading-relaxed font-mono"
      >
        <code>
          {tokenizeJson(value).map((token, index) => (
            <span key={`${index}-${token.type}`} className={tokenClassName(token)}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        aria-label="JSON input"
        className="editor-scrollbar relative z-10 h-full min-h-[360px] w-full resize-none overflow-auto bg-transparent p-4 font-mono text-[13px] leading-relaxed text-transparent caret-teal-300 outline-none selection:bg-teal-500/30 focus:ring-1 focus:ring-inset focus:ring-teal-500/30"
      />
    </div>
  );
}
