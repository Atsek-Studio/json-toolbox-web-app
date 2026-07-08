import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { jsonType } from "../utils/jsonTools.js";

const VALUE_COLORS = {
  string: "text-emerald-400",
  number: "text-sky-400",
  boolean: "text-amber-400",
  null: "text-neutral-500",
};

const BRACKET_COLORS = [
  "text-rose-400",
  "text-amber-300",
  "text-lime-400",
  "text-cyan-400",
  "text-violet-400",
  "text-pink-400",
];

function bracketClassName(depth) {
  return `${BRACKET_COLORS[depth % BRACKET_COLORS.length]} font-semibold`;
}

function ValueLabel({ value }) {
  const type = jsonType(value);
  if (type === "string") return <span className={VALUE_COLORS.string}>"{value}"</span>;
  if (type === "null") return <span className={VALUE_COLORS.null}>null</span>;
  if (type === "boolean") return <span className={VALUE_COLORS.boolean}>{String(value)}</span>;
  return <span className={VALUE_COLORS.number}>{value}</span>;
}

export default function TreeNode({ label, value, path, depth, collapsedPaths, onToggle }) {
  const type = jsonType(value);
  const isContainer = type === "object" || type === "array";
  const isCollapsed = collapsedPaths.has(path);

  if (!isContainer) {
    return (
      <div className="flex items-baseline gap-1.5 py-0.5" style={{ paddingLeft: depth * 16 + 20 }}>
        {label !== null && <span className="text-neutral-400">{label}:</span>}
        <ValueLabel value={value} />
      </div>
    );
  }

  const entries = type === "array" ? value.map((v, i) => [i, v]) : Object.entries(value);
  const count = entries.length;
  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];

  return (
    <div>
      <button
        onClick={() => onToggle(path)}
        className="w-full flex items-center gap-1 py-0.5 hover:bg-neutral-900/60 rounded text-left"
        style={{ paddingLeft: depth * 16 }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
        )}
        {label !== null && <span className="text-neutral-400">{label}:</span>}
        <span className={bracketClassName(depth)}>{bracket[0]}</span>
        {isCollapsed && (
          <>
            <span className="text-neutral-600 text-xs">
              {count} {type === "array" ? "items" : "keys"}
            </span>
            <span className={bracketClassName(depth)}>{bracket[1]}</span>
          </>
        )}
      </button>

      {!isCollapsed && (
        <div>
          {entries.map(([key, val]) => (
            <TreeNode
              key={key}
              label={type === "array" ? String(key) : key}
              value={val}
              path={type === "array" ? `${path}[${key}]` : `${path}.${key}`}
              depth={depth + 1}
              collapsedPaths={collapsedPaths}
              onToggle={onToggle}
            />
          ))}
          <div className={bracketClassName(depth)} style={{ paddingLeft: depth * 16 + 20 }}>
            {bracket[1]}
          </div>
        </div>
      )}
    </div>
  );
}
