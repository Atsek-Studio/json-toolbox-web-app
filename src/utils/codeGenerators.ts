import type { ConvertTarget, FieldNameFormat, JsonValue } from "../types";
import { formatFieldName, formatTypeName } from "./naming";

interface Field {
  key: string;
  sample: JsonValue;
}

type ClassMap = Map<string, Field[]>;

function singularize(value: string): string {
  return value.toLowerCase().endsWith("s") && value.length > 1 ? value.slice(0, -1) : value;
}

function mergeValues(values: JsonValue[]): JsonValue {
  const present = values.filter((value) => value !== null && value !== undefined);
  return present.length ? present[0] : null;
}

function inferFields(value: JsonValue): Field[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value).map(([key, fieldValue]) => ({ key, sample: fieldValue }));
}

function collectClasses(value: JsonValue, className: string, classes: ClassMap = new Map()): ClassMap {
  const root = Array.isArray(value) ? mergeValues(value) : value;
  if (!root || typeof root !== "object" || Array.isArray(root)) return classes;
  if (classes.has(className)) return classes;

  const fields = inferFields(root);
  classes.set(className, fields);

  for (const field of fields) {
    if (field.sample && typeof field.sample === "object") {
      if (Array.isArray(field.sample)) {
        const item = mergeValues(field.sample);
        if (item && typeof item === "object" && !Array.isArray(item)) {
          collectClasses(item, formatTypeName(singularize(field.key)), classes);
        }
      } else {
        collectClasses(field.sample, formatTypeName(field.key), classes);
      }
    }
  }

  return classes;
}

function dartType(value: JsonValue | undefined, key: string): string {
  if (value === null || value === undefined) return "dynamic";
  if (Array.isArray(value)) {
    const item = mergeValues(value);
    return `List<${dartType(item, singularize(key))}>`;
  }
  if (typeof value === "object") return formatTypeName(key);
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
  if (typeof value === "boolean") return "bool";
  return "String";
}

function typescriptType(value: JsonValue | undefined, key: string): string {
  if (value === null || value === undefined) return "string | null";
  if (Array.isArray(value)) {
    const itemType = typescriptType(mergeValues(value), singularize(key));
    const includesNull = value.includes(null) && !itemType.includes("null");
    const combinedType = includesNull ? `${itemType} | null` : itemType;
    return combinedType.includes("|") ? `(${combinedType})[]` : `${combinedType}[]`;
  }
  if (typeof value === "object") return formatTypeName(key);
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

function csharpType(value: JsonValue | undefined, key: string): string {
  if (value === null || value === undefined) return "object";
  if (Array.isArray(value)) return `List<${csharpType(mergeValues(value), singularize(key))}>`;
  if (typeof value === "object") return formatTypeName(key);
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
  if (typeof value === "boolean") return "bool";
  return "string";
}

function generateDart(value: JsonValue, rootName: string, fieldNameFormat: FieldNameFormat): string {
  const classes = collectClasses(value, rootName);
  return [...classes.entries()]
    .map(([className, fields]) => {
      const props = fields.map((field) => `  final ${dartType(field.sample, field.key)} ${formatFieldName(field.key, fieldNameFormat, "camel")};`);
      const ctorArgs = fields.map((field) => `    required this.${formatFieldName(field.key, fieldNameFormat, "camel")},`);
      const fromJson = fields.map((field) => {
        const name = formatFieldName(field.key, fieldNameFormat, "camel");
        const type = dartType(field.sample, field.key);
        if (Array.isArray(field.sample) && type.startsWith("List<") && typeof mergeValues(field.sample) === "object") {
          const itemClass = formatTypeName(singularize(field.key));
          return `      ${name}: (json['${field.key}'] as List).map((item) => ${itemClass}.fromJson(item)).toList(),`;
        }
        if (Array.isArray(field.sample)) {
          return `      ${name}: List<${dartType(mergeValues(field.sample), singularize(field.key))}>.from(json['${field.key}']),`;
        }
        if (field.sample && typeof field.sample === "object" && !Array.isArray(field.sample)) {
          return `      ${name}: ${formatTypeName(field.key)}.fromJson(json['${field.key}']),`;
        }
        return `      ${name}: json['${field.key}'],`;
      });
      const toJson = fields.map((field) => {
        const name = formatFieldName(field.key, fieldNameFormat, "camel");
        if (Array.isArray(field.sample) && typeof mergeValues(field.sample) === "object") {
          return `      '${field.key}': ${name}.map((item) => item.toJson()).toList(),`;
        }
        if (field.sample && typeof field.sample === "object" && !Array.isArray(field.sample)) {
          return `      '${field.key}': ${name}.toJson(),`;
        }
        return `      '${field.key}': ${name},`;
      });

      return `class ${className} {\n${props.join("\n")}\n\n  const ${className}({\n${ctorArgs.join("\n")}\n  });\n\n  factory ${className}.fromJson(Map<String, dynamic> json) {\n    return ${className}(\n${fromJson.join("\n")}\n    );\n  }\n\n  Map<String, dynamic> toJson() {\n    return {\n${toJson.join("\n")}\n    };\n  }\n}`;
    })
    .join("\n\n");
}

function generateTypescriptDto(value: JsonValue, rootName: string, fieldNameFormat: FieldNameFormat): string {
  const classes = collectClasses(value, rootName);
  return [...classes.entries()]
    .map(([className, fields]) => {
      const properties = fields.map((field) => {
        const optional = field.sample === null ? "?" : "";
        return `  ${formatFieldName(field.key, fieldNameFormat, "camel")}${optional}: ${typescriptType(field.sample, field.key)};`;
      });
      return `export interface ${className} {\n${properties.join("\n")}\n}`;
    })
    .join("\n\n");
}

function generateCSharpEntity(value: JsonValue, rootName: string, fieldNameFormat: FieldNameFormat): string {
  const classes = collectClasses(value, rootName);
  return `using System.Collections.Generic;\n\n${[...classes.entries()]
    .map(([className, fields]) => {
      const props = fields.map((field) => `    public ${csharpType(field.sample, field.key)} ${formatFieldName(field.key, fieldNameFormat, "pascal")} { get; set; }`);
      return `public class ${className}\n{\n${props.join("\n")}\n}`;
    })
    .join("\n\n")}`;
}

export function convertJsonToCode(input: string, target: ConvertTarget, rootName = "Root", fieldNameFormat: FieldNameFormat = "language-default"): string {
  const parsed = JSON.parse(input) as JsonValue;
  const className = formatTypeName(rootName);

  if (target === "dart") return generateDart(parsed, className, fieldNameFormat);
  if (target === "typescript") return generateTypescriptDto(parsed, className, fieldNameFormat);
  if (target === "csharp") return generateCSharpEntity(parsed, className, fieldNameFormat);

  throw new Error("Unknown convert target");
}
