import React, { useCallback, useMemo, useState } from "react";
import { Maximize2, Minimize } from "lucide-react";
import ErrorPanel from "./ErrorPanel.jsx";
import IconButton from "./IconButton.jsx";
import PanelHeader from "./PanelHeader.jsx";
import TreeNode from "./TreeNode.jsx";
import { collectContainerPaths, jsonType, locateError } from "../utils/jsonTools.js";

export default function TreeView({ input }) {
  const [collapsedPaths, setCollapsedPaths] = useState(new Set());

  const parsed = useMemo(() => {
    if (!input.trim()) return { value: undefined, error: null };
    try {
      return { value: JSON.parse(input), error: null };
    } catch (e) {
      return {
        value: undefined,
        error: { message: e.message, location: locateError(input, e.message) },
      };
    }
  }, [input]);

  const toggle = useCallback((path) => {
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
        <div className="flex-1 min-h-[360px] bg-neutral-950 p-4 text-xs text-neutral-600">
          Paste JSON on the left to explore it here.
        </div>
      ) : (
        <div className="editor-scrollbar flex-1 min-h-[360px] max-h-[520px] overflow-auto bg-neutral-950 py-3 px-2 text-[13px] font-mono">
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
