import type { SqlColumn, SqlTable } from "../types";

function unquoteIdentifier(value: string): string {
  return value.trim().replace(/^\[|\]$/g, "").replace(/^`|`$/g, "").replace(/^"|"$/g, "");
}

function splitTopLevel(source: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let depth = 0;
  let quote: string | null = null;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === quote && source[index - 1] !== "\\") quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === "`") quote = char;
    else if (char === "(") depth += 1;
    else if (char === ")") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(source.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(source.slice(start).trim());
  return parts.filter(Boolean);
}

function parseType(rawType: string): Pick<SqlColumn, "sqlType" | "baseType" | "length" | "precision" | "scale"> {
  const normalized = rawType.trim().replace(/\s+/g, " ");
  const match = normalized.match(/^([A-Za-z]+(?:\s+(?:varying|precision))?)(?:\s*\((max|\d+)(?:\s*,\s*(\d+))?\))?$/i);
  if (!match) throw new Error(`Unsupported SQL type: ${rawType}`);
  const baseType = match[1].toLowerCase();
  const first = match[2] && match[2].toLowerCase() !== "max" ? Number(match[2]) : undefined;
  const second = match[3] ? Number(match[3]) : undefined;
  const isDecimal = ["decimal", "numeric", "number"].includes(baseType);
  return {
    sqlType: normalized,
    baseType,
    length: isDecimal ? undefined : first,
    precision: isDecimal ? first : undefined,
    scale: isDecimal ? second : undefined,
  };
}

function parseColumn(definition: string): SqlColumn | null {
  if (/^(constraint\s+\S+\s+)?(primary|foreign|unique|check)\s+/i.test(definition)) return null;
  const match = definition.match(/^((?:\[[^\]]+\]|`[^`]+`|"[^"]+"|[A-Za-z_][\w$]*))\s+([A-Za-z]+(?:\s+(?:varying|precision))?(?:\s*\([^)]*\))?)([\s\S]*)$/i);
  if (!match) throw new Error(`Could not parse column: ${definition}`);

  const constraints = match[3];
  const defaultMatch = constraints.match(/\bdefault\s+(\([^)]*\)|'[^']*'|[^\s,]+)/i);
  return {
    name: unquoteIdentifier(match[1]),
    ...parseType(match[2]),
    nullable: !/\bnot\s+null\b/i.test(constraints),
    primaryKey: /\bprimary\s+key\b/i.test(constraints),
    unique: /\bunique\b/i.test(constraints),
    identity: /\bidentity\s*(?:\([^)]*\))?/i.test(constraints) || /\bauto_increment\b/i.test(constraints),
    defaultValue: defaultMatch?.[1],
  };
}

export function parseCreateTable(sql: string): SqlTable {
  const cleaned = sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
  const match = cleaned.match(/create\s+table\s+([^\s(]+)\s*\(([\s\S]*)\)\s*;?\s*$/i);
  if (!match) throw new Error("Expected one CREATE TABLE statement.");

  const qualifiedName = match[1].split(".").map(unquoteIdentifier);
  const definitions = splitTopLevel(match[2]);
  const columns = definitions.map(parseColumn).filter((column): column is SqlColumn => column !== null);
  if (!columns.length) throw new Error("The table does not contain any supported columns.");

  for (const definition of definitions) {
    const primaryKey = definition.match(/(?:constraint\s+\S+\s+)?primary\s+key(?:\s+(?:clustered|nonclustered))?\s*\(([^)]+)\)/i);
    if (!primaryKey) continue;
    const names = splitTopLevel(primaryKey[1]).map((name) => unquoteIdentifier(name.replace(/\s+(asc|desc)$/i, "")));
    for (const column of columns) {
      if (names.some((name) => name.toLowerCase() === column.name.toLowerCase())) column.primaryKey = true;
    }
  }

  for (const column of columns) {
    if (column.primaryKey) column.nullable = false;
  }

  return {
    name: qualifiedName[qualifiedName.length - 1] ?? "Table",
    schema: qualifiedName.length > 1 ? qualifiedName.slice(0, -1).join(".") : undefined,
    columns,
  };
}
