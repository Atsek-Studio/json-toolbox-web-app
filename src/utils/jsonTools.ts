import { convertJsonToCode } from "./codeGenerators";
import Ajv from "ajv";
import type {
  ConvertTarget,
  DiffChange,
  ErrorLocation,
  JsonValue,
  SchemaValidationError,
  ToolboxError,
  TransformAction,
} from "../types";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Pure helpers for JSON processing. No React here, so these are easy
// to unit test or reuse outside the UI.

/**
 * Locates the line/column of a JSON.parse error from its message,
 * since native JSON.parse only reports a character position.
 */
export function locateError(text: string, message: string): ErrorLocation | null {
  const match = message.match(/position (\d+)/);
  if (!match) return null;
  const pos = parseInt(match[1], 10);
  const upto = text.slice(0, pos);
  const line = (upto.match(/\n/g) || []).length + 1;
  const col = pos - upto.lastIndexOf("\n");
  return { line, col, pos };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

/**
 * Runs one of the three text-based transforms against raw input.
 * Returns { output, error } — error is null on success.
 */
interface ProcessOptions {
  convertTarget?: ConvertTarget;
  rootName?: string;
}

export function processJson(
  action: TransformAction,
  input: string,
  indent: number,
  options: ProcessOptions = {},
): { output: string; error: ToolboxError | null } {
  try {
    if (action === "beautify") {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, indent), error: null };
    }
    if (action === "minify") {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed), error: null };
    }
    if (action === "stringify") {
      // Wraps the raw text as an escaped JSON string literal, regardless
      // of whether it happens to be valid JSON itself.
      return { output: JSON.stringify(input), error: null };
    }
    if (action === "convert") {
      return {
        output: convertJsonToCode(input, options.convertTarget ?? "dart", options.rootName),
        error: null,
      };
    }
    return { output: "", error: { message: "Unknown action" } };
  } catch (error) {
    const message = errorMessage(error);
    return {
      output: "",
      error: { message, location: locateError(input, message) },
    };
  }
}

function appendPath(path: string, key: string | number, isArrayIndex = false): string {
  if (isArrayIndex) return `${path}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(String(key))
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`;
}

/**
 * Semantically compares two JSON values. Object property order and whitespace
 * are ignored; arrays are compared by index.
 */
export function diffJsonValues(
  before: JsonValue,
  after: JsonValue,
  path = "$",
  changes: DiffChange[] = [],
): DiffChange[] {
  if (Object.is(before, after)) return changes;

  const beforeIsArray = Array.isArray(before);
  const afterIsArray = Array.isArray(after);
  const beforeIsObject = before !== null && typeof before === "object";
  const afterIsObject = after !== null && typeof after === "object";

  if (beforeIsArray && afterIsArray) {
    const length = Math.max(before.length, after.length);
    for (let index = 0; index < length; index += 1) {
      const itemPath = appendPath(path, index, true);
      if (index >= before.length) changes.push({ type: "added", path: itemPath, value: after[index] });
      else if (index >= after.length) changes.push({ type: "removed", path: itemPath, value: before[index] });
      else diffJsonValues(before[index], after[index], itemPath, changes);
    }
    return changes;
  }

  if (beforeIsObject && afterIsObject && !beforeIsArray && !afterIsArray) {
    const beforeObject = before as Record<string, JsonValue>;
    const afterObject = after as Record<string, JsonValue>;
    const keys = new Set([...Object.keys(beforeObject), ...Object.keys(afterObject)]);
    for (const key of keys) {
      const keyPath = appendPath(path, key);
      if (!Object.prototype.hasOwnProperty.call(beforeObject, key)) {
        changes.push({ type: "added", path: keyPath, value: afterObject[key] });
      } else if (!Object.prototype.hasOwnProperty.call(afterObject, key)) {
        changes.push({ type: "removed", path: keyPath, value: beforeObject[key] });
      } else {
        diffJsonValues(beforeObject[key], afterObject[key], keyPath, changes);
      }
    }
    return changes;
  }

  changes.push({ type: "changed", path, before, after });
  return changes;
}

export function compareJson(beforeText: string, afterText: string): { changes: DiffChange[]; error: ToolboxError | null } {
  try {
    const before = JSON.parse(beforeText) as JsonValue;
    const after = JSON.parse(afterText) as JsonValue;
    return { changes: diffJsonValues(before, after), error: null };
  } catch (error) {
    const message = errorMessage(error);
    const source = (() => {
      try { JSON.parse(beforeText); return "Modified JSON"; } catch { return "Original JSON"; }
    })();
    const text = source === "Original JSON" ? beforeText : afterText;
    return {
      changes: [],
      error: { message: `${source}: ${message}`, location: locateError(text, message) },
    };
  }
}

export function validateJsonSchema(dataText: string, schemaText: string): {
  valid: boolean;
  errors: SchemaValidationError[];
  error: ToolboxError | null;
} {
  let data: unknown;
  let schema: object | boolean;

  try {
    data = JSON.parse(dataText);
  } catch (error) {
    const message = errorMessage(error);
    return {
      valid: false,
      errors: [],
      error: { message: `JSON data: ${message}`, location: locateError(dataText, message) },
    };
  }

  try {
    schema = JSON.parse(schemaText) as object | boolean;
  } catch (error) {
    const message = errorMessage(error);
    return {
      valid: false,
      errors: [],
      error: { message: `JSON Schema: ${message}`, location: locateError(schemaText, message) },
    };
  }

  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    const errors = (validate.errors || []).map((item) => {
      const missing = item.keyword === "required" ? `/${item.params.missingProperty}` : "";
      return {
        path: `$${item.instancePath || ""}${missing}`,
        keyword: item.keyword,
        message: item.message || "is invalid",
        params: item.params,
      };
    });
    return { valid, errors, error: null };
  } catch (error) {
    return { valid: false, errors: [], error: { message: `Invalid JSON Schema: ${errorMessage(error)}` } };
  }
}

/** Returns a short type label used for tree-view badges. */
export function jsonType(value: JsonValue): "null" | "array" | "object" | "string" | "number" | "boolean" {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as "object" | "string" | "number" | "boolean";
}

/**
 * Walks a parsed JSON value and collects the path of every container
 * node (object/array), used to implement expand-all / collapse-all.
 */
export function collectContainerPaths(value: JsonValue, path = "$", acc: string[] = []): string[] {
  const type = jsonType(value);
  if (type === "object") {
    acc.push(path);
    const objectValue = value as Record<string, JsonValue>;
    for (const key of Object.keys(objectValue)) {
      collectContainerPaths(objectValue[key], `${path}.${key}`, acc);
    }
  } else if (type === "array") {
    acc.push(path);
    (value as JsonValue[]).forEach((item, i) => collectContainerPaths(item, `${path}[${i}]`, acc));
  }
  return acc;
}
