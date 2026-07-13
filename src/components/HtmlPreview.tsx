import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Code2, Eye, Pause, Play, RefreshCw, Terminal, Trash2, X } from "lucide-react";
import { buildPreviewDocument, isPreviewConsoleMessage, type PreviewConsoleLevel } from "../utils/htmlPreview";
import PanelHeader from "./PanelHeader";

interface HtmlPreviewProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

interface ConsoleEntry {
  id: number;
  level: PreviewConsoleLevel;
  values: string[];
}

const consoleColors: Record<PreviewConsoleLevel, string> = {
  log: "text-neutral-300",
  info: "text-sky-300",
  warn: "text-amber-300",
  error: "text-red-300",
};

export default function HtmlPreview({ value, onChange, onClear }: HtmlPreviewProps) {
  const [live, setLive] = useState(true);
  const [renderedHtml, setRenderedHtml] = useState(value);
  const [refreshKey, setRefreshKey] = useState(0);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const nextConsoleId = useRef(0);
  const previewId = useMemo(() => `preview-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (!live) return;
    const timer = window.setTimeout(() => setRenderedHtml(value), 400);
    return () => window.clearTimeout(timer);
  }, [live, value]);

  useEffect(() => setConsoleEntries([]), [renderedHtml]);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent<unknown>) => {
      const message = event.data;
      if (event.source !== iframeRef.current?.contentWindow || !isPreviewConsoleMessage(message) || message.previewId !== previewId) return;
      setConsoleEntries((entries) => [
        ...entries.slice(-199),
        { id: nextConsoleId.current++, level: message.level, values: message.values },
      ]);
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [previewId]);

  const refresh = useCallback(() => {
    setConsoleEntries([]);
    setRenderedHtml(value);
    setRefreshKey((key) => key + 1);
  }, [value]);

  const toggleLive = useCallback(() => {
    setLive((current) => {
      if (!current) setRenderedHtml(value);
      return !current;
    });
  }, [value]);

  const previewDocument = useMemo(() => buildPreviewDocument(renderedHtml, previewId), [previewId, renderedHtml]);

  return (
    <div className="grid grid-cols-1 divide-y divide-[#1a1e24] md:grid-cols-2 md:divide-x md:divide-y-0">
      <section className="flex min-w-0 flex-col">
        <PanelHeader title="HTML CODE" meta={<span className="inline-flex items-center gap-1 font-mono text-xs text-[#98a1af]"><Code2 className="h-3 w-3" />{value.length} chars</span>}>
          <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-xs text-[#575f6b] transition-colors hover:bg-[#171b21] hover:text-[#edf0f3]"><Trash2 className="h-3.5 w-3.5" />Clear</button>
        </PanelHeader>
        <div className="editor-surface relative min-h-[520px] flex-1">
          {!value && <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[13px] text-neutral-700">Paste HTML here...</div>}
          <textarea value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} aria-label="HTML code" className="editor-scrollbar relative z-10 h-full min-h-[520px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-[1.75] text-[#edf0f3] outline-none selection:bg-[#60a5fa]/25 focus:ring-1 focus:ring-inset focus:ring-[#60a5fa]/30 sm:p-5" />
        </div>
      </section>

      <section className="flex min-w-0 flex-col bg-white">
        <PanelHeader title="LIVE PREVIEW" meta={<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400"><Eye className="h-3 w-3" />Sandboxed</span>}>
          <div className="flex items-center gap-1">
            <button onClick={toggleLive} aria-pressed={live} title={live ? "Pause live updates" : "Enable live updates"} className={`inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-xs transition-colors ${live ? "border border-[#294c73] bg-[#60a5fa]/15 text-[#60a5fa]" : "text-[#575f6b] hover:bg-[#171b21] hover:text-[#edf0f3]"}`}>{live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{live ? "Live" : "Manual"}</button>
            <button onClick={refresh} title="Refresh preview" className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-xs text-[#575f6b] transition-colors hover:bg-[#171b21] hover:text-[#edf0f3]"><RefreshCw className="h-3.5 w-3.5" />Refresh</button>
          </div>
        </PanelHeader>
        <iframe ref={iframeRef} key={refreshKey} srcDoc={previewDocument} title="HTML live preview" sandbox="allow-scripts" className="min-h-[380px] w-full flex-1 border-0 bg-white" />

        <div className="flex h-40 min-h-40 flex-col border-t border-[#1a1e24] bg-[#0d0f13] text-left">
          <div className="flex items-center justify-between border-b border-[#1a1e24] px-3 py-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500"><Terminal className="h-3.5 w-3.5" />Console <span className="text-neutral-700">{consoleEntries.length}</span></span>
            <button onClick={() => setConsoleEntries([])} disabled={!consoleEntries.length} title="Clear console" className="rounded p-1 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-300 disabled:opacity-30"><X className="h-3.5 w-3.5" /></button>
          </div>
          <div className="editor-scrollbar flex-1 overflow-auto p-2 font-mono text-xs">
            {!consoleEntries.length ? <div className="px-1 py-2 text-neutral-700">Console output will appear here.</div> : consoleEntries.map((entry) => (
              <div key={entry.id} className={`flex gap-2 border-b border-neutral-900 px-1 py-1 leading-relaxed ${consoleColors[entry.level]}`}><span className="w-10 shrink-0 uppercase text-[10px] opacity-60">{entry.level}</span><span className="min-w-0 whitespace-pre-wrap break-words">{entry.values.join(" ")}</span></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
