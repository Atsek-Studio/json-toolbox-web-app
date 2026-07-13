import React, { useCallback, useMemo, useState } from "react";
import { Maximize2, Minimize } from "lucide-react";
import ErrorPanel from "./ErrorPanel";
import IconButton from "./IconButton";
import PanelHeader from "./PanelHeader";
import TreeNode from "./TreeNode";
import { collectContainerPaths, jsonType, locateError } from "../utils/jsonTools";
import type { JsonValue, ToolboxError } from "../types";

interface ParsedInput {
  value: JsonValue | undefined;
  error: ToolboxError | null;
}

export default function TreeView({ input }: { input: string }) {
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());

  const parsed = useMemo<ParsedInput>(() => {
    if (!input.trim()) return { value: undefined, error: null };
    try {
      return { value: JSON.parse(input) as JsonValue, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        value: undefined,
        error: { message, location: locateError(input, message) },
      };
    }
  }, [input]);

  const toggle = useCallback((path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setCollapsedPaths(new Set()), []);
  const collapseAll = useCallback(() => {
    if (parsed.value === undefined) return;
    setCollapsedPaths(new Set(collectContainerPaths(parsed.value)));
  }, [parsed.value]);

  const isContainer =
    parsed.value !== undefined && ["object", "array"].includes(jsonType(parsed.value));

  return (
    <div className="flex flex-col">
      <PanelHeader title="TREE">
        <div className="flex items-center gap-1">
          <IconButton onClick={expandAll} disabled={!isContainer} title="Expand all">
            <Maximize2 className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton onClick={collapseAll} disabled={!isContainer} title="Collapse all">
            <Minimize className="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </PanelHeader>

      {parsed.error ? (
        <ErrorPanel error={parsed.error} />
      ) : parsed.value === undefined ? (
        <div className="min-h-[480px] flex-1 bg-[#0d0f13] p-4 text-xs text-[#575f6b]">
          Paste JSON on the left to explore it here.
        </div>
      ) : (
        <div className="editor-scrollbar min-h-[480px] max-h-[620px] flex-1 overflow-auto bg-[#0d0f13] px-2 py-3 font-mono text-[13px]">
          <TreeNode
            label={null}
            value={parsed.value}
            path="$"
            depth={0}
            collapsedPaths={collapsedPaths}
            onToggle={toggle}
          />
        </div>
      )}
    </div>
  );
}
