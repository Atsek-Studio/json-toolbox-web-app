import { convertJsonToCode } from "./codeGenerators.js";

// Pure helpers for JSON processing. No React here, so these are easy
// to unit test or reuse outside the UI.

/**
 * Locates the line/column of a JSON.parse error from its message,
 * since native JSON.parse only reports a character position.
 */
export function locateError(text, message) {
  const match = message.match(/position (\d+)/);
  if (!match) return null;
  const pos = parseInt(match[1], 10);
  const upto = text.slice(0, pos);
  const line = (upto.match(/\n/g) || []).length + 1;
  const col = pos - upto.lastIndexOf("\n");
  return { line, col, pos };
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

/**
 * Runs one of the three text-based transforms against raw input.
 * Returns { output, error } — error is null on success.
 */
export function processJson(action, input, indent, options = {}) {
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
        output: convertJsonToCode(input, options.convertTarget, options.rootName),
        error: null,
      };
    }
    return { output: "", error: { message: "Unknown action" } };
  } catch (e) {
    return {
      output: "",
      error: { message: e.message, location: locateError(input, e.message) },
    };
  }
}

/** Returns a short type label used for tree-view badges. */
export function jsonType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value; // object, string, number, boolean
}

/**
 * Walks a parsed JSON value and collects the path of every container
 * node (object/array), used to implement expand-all / collapse-all.
 */
export function collectContainerPaths(value, path = "$", acc = []) {
  const type = jsonType(value);
  if (type === "object") {
    acc.push(path);
    for (const key of Object.keys(value)) {
      collectContainerPaths(value[key], `${path}.${key}`, acc);
    }
  } else if (type === "array") {
    acc.push(path);
    value.forEach((item, i) => collectContainerPaths(item, `${path}[${i}]`, acc));
  }
  return acc;
}
