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
    <div className="editor-surface relative min-h-[480px] flex-1">
      {!value && (
        <div className="pointer-events-none absolute inset-0 p-4 text-[13px] leading-relaxed font-mono text-neutral-700">
          Paste your JSON here...
        </div>
      )}

      <pre
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-[1.75] sm:p-5"
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
        className="editor-scrollbar relative z-10 h-full min-h-[480px] w-full resize-none overflow-auto bg-transparent p-4 font-mono text-[13px] leading-[1.75] text-transparent caret-[#60a5fa] outline-none selection:bg-[#60a5fa]/25 focus:ring-1 focus:ring-inset focus:ring-[#60a5fa]/30 sm:p-5"
      />
    </div>
  );
}
