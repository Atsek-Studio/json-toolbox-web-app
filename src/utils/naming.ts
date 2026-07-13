import type { FieldNameFormat } from "../types";

type ConcreteFieldNameFormat = Exclude<FieldNameFormat, "language-default">;

export function splitIdentifierWords(value: string): string[] {
  return String(value)
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function ensureValidIdentifier(value: string, fallback: string): string {
  const result = value || fallback;
  return /^\d/.test(result) ? `_${result}` : result;
}

export function formatFieldName(
  value: string,
  format: FieldNameFormat,
  languageDefault: ConcreteFieldNameFormat,
): string {
  const words = splitIdentifierWords(value);
  const selectedFormat = format === "language-default" ? languageDefault : format;
  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

  if (selectedFormat === "snake") {
    return ensureValidIdentifier(words.join("_"), "field");
  }

  const pascal = words.map(capitalize).join("");
  if (selectedFormat === "pascal") {
    return ensureValidIdentifier(pascal, "Field");
  }

  const camel = words.length ? words[0] + words.slice(1).map(capitalize).join("") : "field";
  return ensureValidIdentifier(camel, "field");
}

export function formatTypeName(value: string, fallback = "Root"): string {
  const words = splitIdentifierWords(value);
  const result = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  return ensureValidIdentifier(result, fallback);
}
