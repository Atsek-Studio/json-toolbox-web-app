import React from "react";

const KEYWORDS = new Set([
  "as",
  "bool",
  "class",
  "const",
  "constructor",
  "double",
  "dynamic",
  "export",
  "factory",
  "final",
  "fromJson",
  "get",
  "int",
  "List",
  "Map",
  "new",
  "object",
  "public",
  "required",
  "return",
  "set",
  "static",
  "string",
  "String",
  "this",
  "toJson",
  "using",
  "var",
]);

type CodeTokenType = "bracket" | "comment" | "keyword" | "number" | "plain" | "punctuation" | "space" | "string" | "type";

interface CodeToken {
  type: CodeTokenType;
  value: string;
}

function tokenizeCode(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const pattern =
    /(\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[{}()[\]<>.,:;=]|\s+|.)/g;

  for (const match of source.matchAll(pattern)) {
    const value = match[0];
    let type: CodeTokenType = "plain";

    if (/^\/\//.test(value) || /^\/\*/.test(value)) type = "comment";
    else if (/^["'`]/.test(value)) type = "string";
    else if (/^\d/.test(value)) type = "number";
    else if (KEYWORDS.has(value)) type = "keyword";
    else if (/^[{}()[\]<>]$/.test(value)) type = "bracket";
    else if (/^[.,:;=]$/.test(value)) type = "punctuation";
    else if (/^\s+$/.test(value)) type = "space";
    else if (/^[A-Z][A-Za-z0-9_]*$/.test(value)) type = "type";

    tokens.push({ type, value });
  }

  return tokens;
}

function tokenClassName(type: CodeTokenType): string {
  const colors: Record<CodeTokenType, string> = {
    bracket: "text-rose-300 font-semibold",
    comment: "text-neutral-500 italic",
    keyword: "text-violet-300",
    number: "text-orange-300",
    plain: "text-neutral-200",
    punctuation: "text-neutral-500",
    space: "text-neutral-200",
    string: "text-emerald-400",
    type: "text-sky-300",
  };

  return colors[type] ?? colors.plain;
}

export default function CodeOutput({ value }: { value: string }) {
  if (!value) {
    return (
      <div className="editor-surface min-h-[480px] flex-1 p-4 font-mono text-[13px] leading-[1.75] text-neutral-700 sm:p-5">
        Result will appear here...
      </div>
    );
  }

  return (
    <pre className="editor-surface editor-scrollbar min-h-[480px] max-h-[620px] flex-1 overflow-auto whitespace-pre p-4 font-mono text-[13px] leading-[1.75] sm:p-5">
      <code>
        {tokenizeCode(value).map((token, index) => (
          <span key={`${index}-${token.type}`} className={tokenClassName(token.type)}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
}
