import type { SqlColumn, SqlConvertTarget, SqlTable } from "../types";

function pascalCase(value: string): string {
  const result = value.replace(/[^A-Za-z0-9]+/g, " ").trim().split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  return result || "Entity";
}

function camelCase(value: string): string {
  const pascal = pascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function csharpType(column: SqlColumn): string {
  const types: Record<string, string> = {
    bigint: "long", int: "int", integer: "int", smallint: "short", tinyint: "byte",
    bit: "bool", boolean: "bool", decimal: "decimal", numeric: "decimal", number: "decimal",
    real: "float", float: "double", "double precision": "double", money: "decimal", smallmoney: "decimal",
    date: "DateOnly", datetime: "DateTime", datetime2: "DateTime", smalldatetime: "DateTime",
    timestamp: "byte[]", time: "TimeOnly", uniqueidentifier: "Guid", uuid: "Guid",
    binary: "byte[]", varbinary: "byte[]", image: "byte[]", json: "string", jsonb: "string",
  };
  const type = types[column.baseType] ?? "string";
  return column.nullable ? `${type}?` : type;
}

function generateCsharpEntity(table: SqlTable): string {
  const className = pascalCase(table.name);
  const primaryKeys = table.columns.filter((column) => column.primaryKey);
  const properties = table.columns.map((column) => {
    const attributes: string[] = [];
    if (column.primaryKey && primaryKeys.length === 1) attributes.push("[Key]");
    if (column.identity) attributes.push("[DatabaseGenerated(DatabaseGeneratedOption.Identity)]");
    if (!column.nullable && csharpType(column) === "string") attributes.push("[Required]");
    if (column.length) attributes.push(`[MaxLength(${column.length})]`);
    attributes.push(`[Column("${column.name}", TypeName = "${column.sqlType.toLowerCase()}")]`);
    const type = csharpType(column);
    const initializer = type === "string" && !column.nullable ? " = null!;" : "";
    return `    ${attributes.join("\n    ")}\n    public ${type} ${pascalCase(column.name)} { get; set; }${initializer}`;
  });
  const tableAttribute = table.schema ? `[Table("${table.name}", Schema = "${table.schema}")]` : `[Table("${table.name}")]`;
  const compositeKey = primaryKeys.length > 1 ? `[PrimaryKey(${primaryKeys.map((column) => `nameof(${pascalCase(column.name)})`).join(", ")})]\n` : "";
  const efImport = primaryKeys.length > 1 ? "using Microsoft.EntityFrameworkCore;\n" : "";
  return `using System;\nusing System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\n${efImport}\n${tableAttribute}\n${compositeKey}public class ${className}\n{\n${properties.join("\n\n")}\n}`;
}

function generateCsharpModel(table: SqlTable): string {
  const className = `${pascalCase(table.name)}Model`;
  const properties = table.columns.map((column) => {
    const type = csharpType(column);
    const initializer = type === "string" || type === "byte[]" ? " = null!;" : "";
    return `    public ${type} ${pascalCase(column.name)} { get; set; }${initializer}`;
  });
  return `using System;\n\npublic class ${className}\n{\n${properties.join("\n\n")}\n}`;
}

function typescriptType(column: SqlColumn): string {
  const integersAndNumbers = ["bigint", "int", "integer", "smallint", "tinyint", "decimal", "numeric", "number", "real", "float", "double precision", "money", "smallmoney"];
  const booleans = ["bit", "boolean"];
  const binary = ["binary", "varbinary", "image", "timestamp"];
  if (integersAndNumbers.includes(column.baseType)) return "number";
  if (booleans.includes(column.baseType)) return "boolean";
  if (binary.includes(column.baseType)) return "number[]";
  return "string";
}

function generateTypescriptDto(table: SqlTable): string {
  const className = `${pascalCase(table.name)}Dto`;
  const properties = table.columns.map((column) => {
    const optional = column.nullable ? "?" : "";
    const nullable = column.nullable ? " | null" : "";
    return `  ${camelCase(column.name)}${optional}: ${typescriptType(column)}${nullable};`;
  });
  return `export interface ${className} {\n${properties.join("\n")}\n}`;
}

function dartType(column: SqlColumn): string {
  const integers = ["bigint", "int", "integer", "smallint", "tinyint"];
  const numbers = ["decimal", "numeric", "number", "real", "float", "double precision", "money", "smallmoney"];
  const booleans = ["bit", "boolean"];
  const dates = ["date", "datetime", "datetime2", "smalldatetime", "timestamp"];
  let type = integers.includes(column.baseType) ? "int" : numbers.includes(column.baseType) ? "double" : booleans.includes(column.baseType) ? "bool" : dates.includes(column.baseType) ? "DateTime" : "String";
  if (column.nullable) type += "?";
  return type;
}

function generateDart(table: SqlTable): string {
  const className = pascalCase(table.name);
  const fields = table.columns.map((column) => `  final ${dartType(column)} ${camelCase(column.name)};`).join("\n");
  const constructor = table.columns.map((column) => `    ${column.nullable ? "" : "required "}this.${camelCase(column.name)},`).join("\n");
  const fromJson = table.columns.map((column) => {
    const name = camelCase(column.name);
    const type = dartType(column).replace("?", "");
    const source = `json['${column.name}']`;
    const value = type === "DateTime" ? `${source} == null ? null : DateTime.parse(${source})` : type === "double" ? `(${source} as num${column.nullable ? "?" : ""})${column.nullable ? "?" : ""}.toDouble()` : source;
    return `      ${name}: ${value},`;
  }).join("\n");
  const toJson = table.columns.map((column) => {
    const name = camelCase(column.name);
    const value = dartType(column).startsWith("DateTime") ? `${name}${column.nullable ? "?" : ""}.toIso8601String()` : name;
    return `      '${column.name}': ${value},`;
  }).join("\n");
  return `class ${className} {\n${fields}\n\n  const ${className}({\n${constructor}\n  });\n\n  factory ${className}.fromJson(Map<String, dynamic> json) {\n    return ${className}(\n${fromJson}\n    );\n  }\n\n  Map<String, dynamic> toJson() {\n    return {\n${toJson}\n    };\n  }\n}`;
}

export function generateFromSql(table: SqlTable, target: SqlConvertTarget): string {
  if (target === "csharp-entity") return generateCsharpEntity(table);
  if (target === "csharp-model") return generateCsharpModel(table);
  if (target === "typescript-dto") return generateTypescriptDto(table);
  return generateDart(table);
}
