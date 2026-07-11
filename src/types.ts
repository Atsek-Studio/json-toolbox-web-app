export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type ToolboxAction = "beautify" | "minify" | "stringify" | "convert" | "diff" | "schema";
export type TransformAction = Exclude<ToolboxAction, "diff" | "schema">;
export type WorkspaceTab = "json" | "html" | "sql";
export type SqlConvertTarget = "csharp-entity" | "csharp-model" | "typescript-dto" | "dart";

export interface SqlColumn {
  name: string;
  sqlType: string;
  baseType: string;
  length?: number;
  precision?: number;
  scale?: number;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  identity: boolean;
  defaultValue?: string;
}

export interface SqlTable {
  name: string;
  schema?: string;
  columns: SqlColumn[];
}
export type ConvertTarget = "dart" | "typescript" | "csharp";
export type ToolboxView = "text" | "tree";

export interface ErrorLocation {
  line: number;
  col: number;
  pos: number;
}

export interface ToolboxError {
  message: string;
  location?: ErrorLocation | null;
}

export type DiffChange =
  | { type: "added" | "removed"; path: string; value: JsonValue }
  | { type: "changed"; path: string; before: JsonValue; after: JsonValue };

export interface SchemaValidationError {
  path: string;
  keyword: string;
  message: string;
  params: Record<string, unknown>;
}

export interface SchemaResult {
  valid: boolean;
  errors: SchemaValidationError[];
}
