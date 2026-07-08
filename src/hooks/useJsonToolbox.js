import { useCallback, useMemo, useState } from "react";
import { SAMPLE_JSON } from "../utils/sampleJson.js";
import { processJson } from "../utils/jsonTools.js";

export function useJsonToolbox() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("text");
  const [convertTarget, setConvertTarget] = useState("dart");
  const [rootName, setRootName] = useState("Root");

  const inputBytes = useMemo(() => new Blob([input]).size, [input]);
  const outputBytes = useMemo(() => new Blob([output]).size, [output]);

  const handleAction = useCallback(
    (action) => {
      setCopied(false);
      const result = processJson(action, input, indent, { convertTarget, rootName });
      setOutput(result.output);
      setError(result.error);
      setLastAction(action);
    },
    [convertTarget, input, indent, rootName]
  );

  const handleConvertTargetChange = useCallback(
    (nextTarget) => {
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
    (nextRootName) => {
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

  const reduction =
    lastAction === "minify" && !error && inputBytes > 0
      ? Math.max(0, Math.round((1 - outputBytes / inputBytes) * 100))
      : null;

  const isValid = Boolean(lastAction && !error && output);

  return {
    input,
    setInput,
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
    reduction,
    isValid,
    handleAction,
    handleCopy,
    handleClear,
    handleSwap,
  };
}
