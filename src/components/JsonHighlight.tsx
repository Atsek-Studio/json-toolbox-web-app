import React from "react";

const BRACKET_COLORS = [
  "text-rose-400",
  "text-amber-300",
  "text-lime-400",
  "text-cyan-400",
  "text-violet-400",
  "text-pink-400",
];

type JsonTokenType = "key" | "string" | "number" | "boolean" | "null" | "punctuation" | "whitespace" | "bracket";

export interface JsonToken {
  type: JsonTokenType;
  value: string;
  depth?: number;
}

const TOKEN_COLORS: Record<Exclude<JsonTokenType, "bracket">, string> = {
  key: "text-sky-300",
  string: "text-emerald-400",
  number: "text-orange-300",
  boolean: "text-purple-300",
  null: "text-neutral-500",
  punctuation: "text-neutral-500",
  whitespace: "text-neutral-200",
};

function readString(source: string, start: number): string {
  let end = start + 1;
  let escaped = false;

  while (end < source.length) {
    const char = source[end];
    if (escaped) {
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === "\"") {
      end += 1;
      break;
    }
    end += 1;
  }

  return source.slice(start, end);
}

function isObjectKey(source: string, end: number): boolean {
  for (let i = end; i < source.length; i += 1) {
    const char = source[i];
    if (/\s/.test(char)) continue;
    return char === ":";
  }
  return false;
}

export function tokenizeJson(source: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let depth = 0;
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (/\s/.test(char)) {
      let end = i + 1;
      while (end < source.length && /\s/.test(source[end])) end += 1;
      tokens.push({ type: "whitespace", value: source.slice(i, end) });
      i = end;
      continue;
    }

    if (char === "\"") {
      const value = readString(source, i);
      const end = i + value.length;
      tokens.push({ type: isObjectKey(source, end) ? "key" : "string", value });
      i = end;
      continue;
    }

    if (char === "{" || char === "[") {
      tokens.push({ type: "bracket", value: char, depth });
      depth += 1;
      i += 1;
      continue;
    }

    if (char === "}" || char === "]") {
      depth = Math.max(0, depth - 1);
      tokens.push({ type: "bracket", value: char, depth });
      i += 1;
      continue;
    }

    if (char === ":" || char === ",") {
      tokens.push({ type: "punctuation", value: char });
      i += 1;
      continue;
    }

    const numberMatch = source.slice(i).match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (numberMatch) {
      tokens.push({ type: "number", value: numberMatch[0] });
      i += numberMatch[0].length;
      continue;
    }

    const literalMatch = source.slice(i).match(/^(true|false|null)/);
    if (literalMatch) {
      tokens.push({
        type: literalMatch[0] === "null" ? "null" : "boolean",
        value: literalMatch[0],
      });
      i += literalMatch[0].length;
      continue;
    }

    tokens.push({ type: "punctuation", value: char });
    i += 1;
  }

  return tokens;
}

export function tokenClassName(token: JsonToken): string {
  if (token.type === "bracket") {
    return `${BRACKET_COLORS[(token.depth ?? 0) % BRACKET_COLORS.length]} font-semibold`;
  }
  return TOKEN_COLORS[token.type] ?? "text-neutral-200";
}

export default function JsonHighlight({ value }: { value: string }) {
  if (!value) {
    return (
      <div className="editor-surface min-h-[480px] flex-1 p-4 font-mono text-[13px] leading-[1.75] text-neutral-700 sm:p-5">
        Result will appear here...
      </div>
    );
  }

  return (
    <pre className="editor-surface editor-scrollbar min-h-[480px] max-h-[620px] flex-1 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-[1.75] sm:p-5">
      <code>
        {tokenizeJson(value).map((token, index) => (
          <span key={`${index}-${token.type}`} className={tokenClassName(token)}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
}
