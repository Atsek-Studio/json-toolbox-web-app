import { useCallback, useMemo, useState } from "react";
import { SAMPLE_JSON } from "../utils/sampleJson";
import { compareJson, processJson, validateJsonSchema } from "../utils/jsonTools";
import type {
  ConvertTarget,
  DiffChange,
  SchemaResult,
  ToolboxAction,
  ToolboxError,
  ToolboxView,
  TransformAction,
} from "../types";

const SAMPLE_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "version": { "type": "number", "minimum": 1 },
    "features": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "additionalProperties": true
}`;

const SAMPLE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML Preview</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; color: #172033; }
      .card { max-width: 32rem; padding: 1.5rem; border: 1px solid #dbe2ea; border-radius: 1rem; }
      h1 { margin-top: 0; color: #0f766e; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Hello, HTML!</h1>
      <p>Edit this document to see the preview update instantly.</p>
    </main>
  </body>
</html>`;

export function useJsonToolbox() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<ToolboxError | null>(null);
  const [lastAction, setLastAction] = useState<ToolboxAction | null>(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<ToolboxView>("text");
  const [convertTarget, setConvertTarget] = useState<ConvertTarget>("dart");
  const [rootName, setRootName] = useState("Root");
  const [diffInput, setDiffInput] = useState(SAMPLE_JSON);
  const [diffChanges, setDiffChanges] = useState<DiffChange[]>([]);
  const [diffHasCompared, setDiffHasCompared] = useState(false);
  const [schemaInput, setSchemaInput] = useState(SAMPLE_SCHEMA);
  const [schemaResult, setSchemaResult] = useState<SchemaResult | null>(null);
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML);

  const inputBytes = useMemo(() => new Blob([input]).size, [input]);
  const outputBytes = useMemo(() => new Blob([output]).size, [output]);
  const htmlBytes = useMemo(() => new Blob([htmlInput]).size, [htmlInput]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    if (lastAction === "diff") setDiffHasCompared(false);
    if (lastAction === "schema") setSchemaResult(null);
  }, [lastAction]);

  const handleDiffInputChange = useCallback((value: string) => {
    setDiffInput(value);
    setDiffHasCompared(false);
  }, []);

  const handleSchemaInputChange = useCallback((value: string) => {
    setSchemaInput(value);
    setSchemaResult(null);
  }, []);

  const handleAction = useCallback(
    (action: ToolboxAction) => {
      setCopied(false);
      if (action === "diff") {
        setDiffChanges([]);
        setDiffHasCompared(false);
        setError(null);
        setLastAction(action);
        return;
      }
      if (action === "schema") {
        setSchemaResult(null);
        setError(null);
        setLastAction(action);
        return;
      }
      const result = processJson(action as TransformAction, input, indent, { convertTarget, rootName });
      setOutput(result.output);
      setError(result.error);
      setLastAction(action);
    },
    [convertTarget, diffInput, input, indent, rootName]
  );

  const handleCompare = useCallback(() => {
    setCopied(false);
    const result = compareJson(input, diffInput);
    setDiffChanges(result.changes);
    setError(result.error);
    setDiffHasCompared(true);
  }, [diffInput, input]);

  const handleValidateSchema = useCallback(() => {
    setCopied(false);
    const result = validateJsonSchema(input, schemaInput);
    setSchemaResult({ valid: result.valid, errors: result.errors });
    setError(result.error);
  }, [input, schemaInput]);

  const handleConvertTargetChange = useCallback(
    (nextTarget: ConvertTarget) => {
      setConvertTarget(nextTarget);
      if (lastAction !== "convert") return;

      setCopied(false);
      const result = processJson("convert", input, indent, {
        convertTarget: nextTarget,
        rootName,
      });
      setOutput(result.output);
      setError(result.error);
    },
    [input, indent, lastAction, rootName]
  );

  const handleRootNameChange = useCallback(
    (nextRootName: string) => {
      setRootName(nextRootName);
      if (lastAction !== "convert") return;

      setCopied(false);
      const result = processJson("convert", input, indent, {
        convertTarget,
        rootName: nextRootName,
      });
      setOutput(result.output);
      setError(result.error);
    },
    [convertTarget, input, indent, lastAction]
  );

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked in non-secure contexts.
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setDiffInput("");
    setDiffChanges([]);
    setDiffHasCompared(false);
    setSchemaInput("");
    setSchemaResult(null);
    setOutput("");
    setError(null);
    setLastAction(null);
  }, []);

  const handleSwap = useCallback(() => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError(null);
    setLastAction(null);
  }, [output]);

  const handleClearHtml = useCallback(() => setHtmlInput(""), []);

  const reduction =
    lastAction === "minify" && !error && inputBytes > 0
      ? Math.max(0, Math.round((1 - outputBytes / inputBytes) * 100))
      : null;

  const isValid = Boolean(lastAction && !error && output);

  return {
    input,
    setInput: handleInputChange,
    output,
    indent,
    setIndent,
    error,
    lastAction,
    copied,
    view,
    setView,
    convertTarget,
    setConvertTarget: handleConvertTargetChange,
    rootName,
    setRootName: handleRootNameChange,
    inputBytes,
    outputBytes,
    htmlBytes,
    reduction,
    isValid,
    diffInput,
    setDiffInput: handleDiffInputChange,
    diffChanges,
    diffHasCompared,
    schemaInput,
    setSchemaInput: handleSchemaInputChange,
    schemaResult,
    htmlInput,
    setHtmlInput,
    handleAction,
    handleCompare,
    handleValidateSchema,
    handleCopy,
    handleClear,
    handleSwap,
    handleClearHtml,
  };
}
