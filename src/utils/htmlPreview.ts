export type PreviewConsoleLevel = "log" | "info" | "warn" | "error";

export interface PreviewConsoleMessage {
  source: "json-toolbox-html-preview";
  previewId: string;
  level: PreviewConsoleLevel;
  values: string[];
}

function instrumentationScript(previewId: string): string {
  return `<script>
(() => {
  const source = "json-toolbox-html-preview";
  const previewId = ${JSON.stringify(previewId)};
  const serialize = (value) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.stack || value.message;
    try {
      const json = JSON.stringify(value);
      return json === undefined ? String(value) : json;
    } catch {
      return String(value);
    }
  };
  const send = (level, values) => {
    window.parent.postMessage({ source, previewId, level, values: values.map(serialize) }, "*");
  };
  for (const level of ["log", "info", "warn", "error"]) {
    const original = console[level].bind(console);
    console[level] = (...values) => {
      send(level, values);
      original(...values);
    };
  }
  window.addEventListener("error", (event) => {
    send("error", [event.error || event.message]);
  });
  window.addEventListener("unhandledrejection", (event) => {
    send("error", ["Unhandled promise rejection:", event.reason]);
  });
  window.parent.postMessage({ source, previewId, level: "info", values: ["Preview loaded"] }, "*");
})();
</script>`;
}

export function buildPreviewDocument(html: string, previewId: string): string {
  const script = instrumentationScript(previewId);
  const headMatch = html.match(/<head(?:\s[^>]*)?>/i);
  if (!headMatch || headMatch.index === undefined) return `${script}${html}`;
  const insertAt = headMatch.index + headMatch[0].length;
  return `${html.slice(0, insertAt)}${script}${html.slice(insertAt)}`;
}

export function isPreviewConsoleMessage(value: unknown): value is PreviewConsoleMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<PreviewConsoleMessage>;
  return message.source === "json-toolbox-html-preview"
    && typeof message.previewId === "string"
    && ["log", "info", "warn", "error"].includes(message.level ?? "")
    && Array.isArray(message.values)
    && message.values.every((item) => typeof item === "string");
}
