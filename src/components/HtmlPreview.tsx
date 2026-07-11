import React from "react";
import { Code2, Eye, Trash2 } from "lucide-react";
import PanelHeader from "./PanelHeader";

interface HtmlPreviewProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function HtmlPreview({ value, onChange, onClear }: HtmlPreviewProps) {
  return (
    <div className="grid grid-cols-1 divide-y divide-neutral-800 md:grid-cols-2 md:divide-x md:divide-y-0">
      <section className="flex min-w-0 flex-col">
        <PanelHeader title="HTML CODE" meta={<span className="inline-flex items-center gap-1 text-xs text-neutral-600"><Code2 className="h-3 w-3" />{value.length} chars</span>}>
          <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"><Trash2 className="h-3.5 w-3.5" />Clear</button>
        </PanelHeader>
        <div className="editor-surface relative min-h-[520px] flex-1 bg-neutral-950">
          {!value && <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[13px] text-neutral-700">Paste HTML here...</div>}
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            aria-label="HTML code"
            className="editor-scrollbar relative z-10 h-full min-h-[520px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-neutral-200 outline-none selection:bg-teal-500/30 focus:ring-1 focus:ring-inset focus:ring-teal-500/30"
          />
        </div>
      </section>

      <section className="flex min-w-0 flex-col bg-white">
        <PanelHeader
          title="LIVE PREVIEW"
          meta={<span className="inline-flex items-center gap-1 text-xs text-teal-400"><Eye className="h-3 w-3" />Sandboxed</span>}
        />
        <iframe
          key={value}
          srcDoc={value}
          title="HTML live preview"
          sandbox="allow-scripts"
          className="min-h-[520px] w-full flex-1 border-0 bg-white"
        />
      </section>
    </div>
  );
}
