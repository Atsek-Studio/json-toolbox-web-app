import React from "react";
import { AlignLeft, Braces, Code2, GitCompareArrows, ListTree, Minimize2, Quote, ShieldCheck, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ConvertTarget, FieldNameFormat, ToolboxAction, ToolboxView } from "../types";

const ACTION_GROUPS: { key: ToolboxAction; label: string; icon: LucideIcon }[][] = [
  [
    { key: "beautify", label: "Beautify", icon: Braces },
    { key: "minify", label: "Minify", icon: Minimize2 },
    { key: "stringify", label: "Stringify", icon: Quote },
  ],
  [
    { key: "convert", label: "Convert", icon: Code2 },
    { key: "diff", label: "Diff", icon: GitCompareArrows },
    { key: "schema", label: "Schema", icon: ShieldCheck },
  ],
];

function actionClassName(isActive: boolean): string {
  return `inline-flex items-center gap-1.5 whitespace-nowrap rounded-[7px] border px-3 py-1.5 text-xs font-medium transition-colors ${
    isActive
      ? "border-[#294c73] bg-[#60a5fa]/15 text-[#60a5fa]"
      : "border-transparent bg-transparent text-[#98a1af] hover:bg-[#171b21] hover:text-[#edf0f3]"
  }`;
}

function segmentedClassName(isActive: boolean): string {
  return `inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs transition-colors ${
    isActive ? "bg-[#171b21] text-[#edf0f3]" : "bg-transparent text-[#575f6b] hover:text-[#edf0f3]"
  }`;
}

interface ToolbarProps {
  onAction: (action: ToolboxAction) => void;
  activeAction: ToolboxAction | null;
  onClear: () => void;
  view: ToolboxView;
  onViewChange: (view: ToolboxView) => void;
  convertTarget: ConvertTarget;
  onConvertTargetChange: (target: ConvertTarget) => void;
  rootName: string;
  onRootNameChange: (name: string) => void;
  fieldNameFormat: FieldNameFormat;
  onFieldNameFormatChange: (format: FieldNameFormat) => void;
  onCompare: () => void;
  onValidateSchema: () => void;
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
  fieldNameFormat,
  onFieldNameFormatChange,
  onCompare,
  onValidateSchema,
}: ToolbarProps) {
  const showConvertOptions = activeAction === "convert";

  return (
    <div className="surface-bar border-b border-[#1a1e24]">
      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-4">
        {ACTION_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="control-surface flex gap-1 rounded-[10px] border p-1">
            {group.map((action) => {
              const Icon = action.icon;
              const isActive = activeAction === action.key;

              return (
                <button
                  key={action.key}
                  onClick={() => onAction(action.key)}
                  className={actionClassName(isActive)}
                  aria-pressed={isActive}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              );
            })}
          </div>
        ))}

        {activeAction === "diff" && (
          <button
            onClick={onCompare}
            className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#294c73] bg-[#60a5fa]/15 px-3 py-2 text-xs font-semibold text-[#60a5fa] transition-colors hover:bg-[#60a5fa]/20"
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            Compare JSON
          </button>
        )}

        {activeAction === "schema" && (
          <button
            onClick={onValidateSchema}
            className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#294c73] bg-[#60a5fa]/15 px-3 py-2 text-xs font-semibold text-[#60a5fa] transition-colors hover:bg-[#60a5fa]/20"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Validate JSON
          </button>
        )}

        <div className="flex-1" />

        {activeAction !== "diff" && activeAction !== "schema" && <div className="control-surface inline-flex items-center gap-1 rounded-[10px] border p-1">
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
        </div>}

        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-2 text-xs text-[#575f6b] transition-colors hover:bg-[#171b21] hover:text-[#edf0f3]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {showConvertOptions && (
        <div className="flex flex-wrap items-end gap-3 border-t border-[#1a1e24] bg-[#0d0f13]/65 px-4 py-3 sm:px-5">
          <span className="self-center text-[10px] font-semibold uppercase tracking-wider text-[#575f6b]">
            Convert settings
          </span>

          <label className="flex min-w-40 flex-1 flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-[#575f6b] sm:max-w-56">
            Target
            <select
              value={convertTarget}
              onChange={(event) => onConvertTargetChange(event.target.value as ConvertTarget)}
              className="control-surface h-8 rounded-[7px] border px-2.5 text-xs normal-case tracking-normal text-[#edf0f3] outline-none focus:border-[#60a5fa]"
            >
              <option value="dart">Dart model</option>
              <option value="typescript">TypeScript DTO</option>
              <option value="csharp">C# entity</option>
            </select>
          </label>

          <label className="flex min-w-36 flex-1 flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-[#575f6b] sm:max-w-48">
            Root class
            <input
              value={rootName}
              onChange={(event) => onRootNameChange(event.target.value)}
              placeholder="Root"
              className="control-surface h-8 rounded-[7px] border px-2.5 font-mono text-xs normal-case tracking-normal text-[#edf0f3] outline-none placeholder:text-[#575f6b] focus:border-[#60a5fa]"
            />
          </label>

          <label className="flex min-w-44 flex-1 flex-col gap-1 text-[10px] font-medium uppercase tracking-wide text-[#575f6b] sm:max-w-60">
            Field naming
            <select
              value={fieldNameFormat}
              onChange={(event) => onFieldNameFormatChange(event.target.value as FieldNameFormat)}
              className="control-surface h-8 rounded-[7px] border px-2.5 text-xs normal-case tracking-normal text-[#edf0f3] outline-none focus:border-[#60a5fa]"
            >
              <option value="language-default">Language default</option>
              <option value="camel">camelCase</option>
              <option value="pascal">PascalCase</option>
              <option value="snake">snake_case</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
