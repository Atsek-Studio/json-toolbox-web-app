function toPascalCase(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") || "Root";
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function singularize(value) {
  return value.endsWith("s") && value.length > 1 ? value.slice(0, -1) : value;
}

function mergeValues(values) {
  const present = values.filter((value) => value !== null && value !== undefined);
  return present.length ? present[0] : null;
}

function inferFields(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value).map(([key, fieldValue]) => ({ key, sample: fieldValue }));
}

function collectClasses(value, className, classes = new Map()) {
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
          collectClasses(item, toPascalCase(singularize(field.key)), classes);
        }
      } else {
        collectClasses(field.sample, toPascalCase(field.key), classes);
      }
    }
  }

  return classes;
}

function dartType(value, key) {
  if (value === null || value === undefined) return "dynamic";
  if (Array.isArray(value)) {
    const item = mergeValues(value);
    return `List<${dartType(item, singularize(key))}>`;
  }
  if (typeof value === "object") return toPascalCase(key);
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
  if (typeof value === "boolean") return "bool";
  return "String";
}

function jsType(value, key) {
  if (value === null || value === undefined) return "any";
  if (Array.isArray(value)) return `${jsType(mergeValues(value), singularize(key))}[]`;
  if (typeof value === "object") return toPascalCase(key);
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

function csharpType(value, key) {
  if (value === null || value === undefined) return "object";
  if (Array.isArray(value)) return `List<${csharpType(mergeValues(value), singularize(key))}>`;
  if (typeof value === "object") return toPascalCase(key);
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
  if (typeof value === "boolean") return "bool";
  return "string";
}

function generateDart(value, rootName) {
  const classes = collectClasses(value, rootName);
  return [...classes.entries()]
    .map(([className, fields]) => {
      const props = fields.map((field) => `  final ${dartType(field.sample, field.key)} ${toCamelCase(field.key)};`);
      const ctorArgs = fields.map((field) => `    required this.${toCamelCase(field.key)},`);
      const fromJson = fields.map((field) => {
        const name = toCamelCase(field.key);
        const type = dartType(field.sample, field.key);
        if (Array.isArray(field.sample) && type.startsWith("List<") && typeof mergeValues(field.sample) === "object") {
          const itemClass = toPascalCase(singularize(field.key));
          return `      ${name}: (json['${field.key}'] as List).map((item) => ${itemClass}.fromJson(item)).toList(),`;
        }
        if (Array.isArray(field.sample)) {
          return `      ${name}: List<${dartType(mergeValues(field.sample), singularize(field.key))}>.from(json['${field.key}']),`;
        }
        if (field.sample && typeof field.sample === "object" && !Array.isArray(field.sample)) {
          return `      ${name}: ${toPascalCase(field.key)}.fromJson(json['${field.key}']),`;
        }
        return `      ${name}: json['${field.key}'],`;
      });
      const toJson = fields.map((field) => {
        const name = toCamelCase(field.key);
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

function generateJsDto(value, rootName) {
  const classes = collectClasses(value, rootName);
  return [...classes.entries()]
    .map(([className, fields]) => {
      const typedef = fields.map((field) => ` * @property {${jsType(field.sample, field.key)}} ${toCamelCase(field.key)}`);
      const assignments = fields.map((field) => `    this.${toCamelCase(field.key)} = data.${field.key};`);
      return `/**\n${typedef.join("\n")}\n */\nexport class ${className}Dto {\n  constructor(data = {}) {\n${assignments.join("\n")}\n  }\n}`;
    })
    .join("\n\n");
}

function generateCSharpEntity(value, rootName) {
  const classes = collectClasses(value, rootName);
  return `using System.Collections.Generic;\n\n${[...classes.entries()]
    .map(([className, fields]) => {
      const props = fields.map((field) => `    public ${csharpType(field.sample, field.key)} ${toPascalCase(field.key)} { get; set; }`);
      return `public class ${className}\n{\n${props.join("\n")}\n}`;
    })
    .join("\n\n")}`;
}

export function convertJsonToCode(input, target, rootName = "Root") {
  const parsed = JSON.parse(input);
  const className = toPascalCase(rootName);

  if (target === "dart") return generateDart(parsed, className);
  if (target === "js") return generateJsDto(parsed, className);
  if (target === "csharp") return generateCSharpEntity(parsed, className);

  throw new Error("Unknown convert target");
}
