import React from "react";
import { AlignLeft, Braces, Code2, ListTree, Minimize2, Quote, Trash2 } from "lucide-react";

const ACTIONS = [
  { key: "beautify", label: "Beautify", icon: Braces },
  { key: "minify", label: "Minify", icon: Minimize2 },
  { key: "stringify", label: "Stringify", icon: Quote },
  { key: "convert", label: "Convert", icon: Code2 },
];

function actionClassName(isActive) {
  return `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
    isActive
      ? "bg-teal-600 border-teal-500 text-white shadow-sm shadow-teal-950"
      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
  }`;
}

function segmentedClassName(isActive) {
  return `inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors ${
    isActive ? "bg-neutral-700 text-neutral-100" : "bg-transparent text-neutral-500 hover:text-neutral-300"
  }`;
}

export default function Toolbar({
  onAction,
  activeAction,
  onClear,
  view,
  onViewChange,
  convertTarget,
  onConvertTargetChange,
  rootName,
  onRootNameChange,
}) {
  const showConvertOptions = activeAction === "convert";

  return (
    <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-neutral-800 bg-neutral-900/30">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        const isActive = activeAction === action.key;

        return (
          <button
            key={action.key}
            onClick={() => onAction(action.key)}
            className={actionClassName(isActive)}
            aria-pressed={isActive}
          >
            <Icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        );
      })}

      <div className="w-px h-5 bg-neutral-800 mx-1" />

      {showConvertOptions && (
        <>
          <div className="inline-flex items-center gap-1 text-xs text-neutral-500">
            <span className="mr-1">Target</span>
            <select
              value={convertTarget}
              onChange={(e) => onConvertTargetChange(e.target.value)}
              className="h-7 rounded border border-neutral-700 bg-neutral-950 px-2 text-xs text-neutral-100 outline-none focus:border-teal-500/70"
            >
              <option value="dart">Dart model</option>
              <option value="js">JS DTO</option>
              <option value="csharp">C# entity</option>
            </select>
          </div>

          <input
            value={rootName}
            onChange={(e) => onRootNameChange(e.target.value)}
            placeholder="Root class"
            className="h-7 w-28 rounded border border-neutral-700 bg-neutral-950 px-2 text-xs text-neutral-100 outline-none placeholder-neutral-600 focus:border-teal-500/70"
          />
        </>
      )}

      <div className="flex-1" />

      <div className="inline-flex items-center rounded-md border border-neutral-800 overflow-hidden">
        <button
          onClick={() => onViewChange("text")}
          className={segmentedClassName(view === "text")}
          aria-pressed={view === "text"}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          Text
        </button>
        <button
          onClick={() => onViewChange("tree")}
          className={segmentedClassName(view === "tree")}
          aria-pressed={view === "tree"}
        >
          <ListTree className="w-3.5 h-3.5" />
          Tree
        </button>
      </div>

      <button
        onClick={onClear}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Clear
      </button>
    </div>
  );
}
