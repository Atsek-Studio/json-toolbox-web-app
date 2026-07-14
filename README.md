<div align="center">

# JSON Toolbox

### Format JSON, preview HTML, and turn SQL tables into application models.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![CI](https://github.com/Atsek-Studio/json-toolbox-web-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Atsek-Studio/json-toolbox-web-app/actions/workflows/ci.yml)

A private, browser-based developer workspace built with React, strict TypeScript, Vite, and Tailwind CSS.

**All editor processing happens locally in your browser. Editor content is never intentionally included in analytics.**

[Features](#features) · [Quick start](#getting-started) · [Project structure](#project-structure) · [Development](#development-workflow)

</div>

## At a glance

| Workspace | What it does | Key outputs |
| --- | --- | --- |
| **JSON Toolbox** | Format, inspect, compare, validate, and convert JSON | Dart models, TypeScript DTOs, C# entities |
| **HTML Viewer** | Render HTML/CSS/JavaScript in an isolated live preview | Sandboxed page with captured console output |
| **SQL Converter** | Parse DDL from four SQL dialects | EF Core entities, C# models, TypeScript DTOs, Dart models |

> [!NOTE]
> The app is intentionally client-only. JSON, HTML, SQL, generated code, and console output remain on the local device. Standard page-view analytics are collected through Vercel Web Analytics without custom editor-content events.

## Features

### Format and transform

- **Beautify** parses JSON and formats it with readable indentation.
- **Minify** removes unnecessary whitespace and reports the size reduction.
- **Stringify** converts the editor contents into an escaped JSON string literal.
- **Copy output** writes generated output to the clipboard.
- **Swap output** moves JSON output back into the input editor.
- The JSON input uses an integrated code editor so syntax highlighting, selection, and copied text remain aligned for long or wrapped documents.
- **Clear** resets the current workspace.

### Convert JSON to code

Generate typed structures from representative JSON data:

- Dart model classes with `fromJson` and `toJson` methods
- TypeScript DTO interfaces with typed arrays, nested interfaces, and nullable properties
- C# entity classes

The root class name can be changed before generating code. Nested objects and arrays of objects generate additional classes.

Choose how generated field names are formatted:

- **Language default:** camelCase for TypeScript and Dart; PascalCase for C#.
- **camelCase**
- **PascalCase**
- **snake_case**

Uppercase, snake case, kebab case, and existing camel/Pascal identifiers are normalized consistently. For example, `SUPPLIERS_CODE` becomes `suppliersCode`, `SuppliersCode`, or `suppliers_code` according to the selected format.

### Explore JSON as a tree

- Recursively browse objects and arrays.
- Expand or collapse individual containers.
- Expand or collapse the entire document.
- View color-coded values and container types.
- See JSON parsing errors with line and column information.

### Compare JSON

Diff mode provides two editable documents and an explicit **Compare JSON** action.

- Compares parsed JSON values instead of raw formatting.
- Ignores whitespace and object property order.
- Compares arrays by index.
- Detects added, removed, and changed values.
- Shows JSONPath-style semantic change locations.
- Renders a GitHub-style split diff with old and new line numbers.
- Highlights removed lines in red and added lines in green.
- Hides stale results when either document is edited.

### Validate JSON Schema

Schema mode provides editors for JSON data and a JSON Schema, followed by an explicit **Validate JSON** action.

- Uses [Ajv](https://ajv.js.org/) for standards-based validation.
- Includes a starter Draft-07 schema.
- Collects all validation failures instead of stopping at the first error.
- Reports paths such as `$/user/age`.
- Displays validation keywords including `required`, `type`, and `minimum`.
- Separately reports malformed JSON, malformed schemas, and schema validation failures.
- Hides stale results after the data or schema changes.

### Preview HTML

The dedicated **HTML Viewer** tab provides a code editor and a live browser preview side by side.

- Paste or write a complete HTML document or fragment.
- See HTML and CSS changes render immediately.
- Debounce live updates while typing to avoid reloading on every keystroke.
- Switch between Live and Manual preview modes.
- Refresh the iframe explicitly to rerun the current document and its scripts.
- Run embedded JavaScript inside an isolated iframe sandbox.
- Inspect `console.log`, `console.info`, `console.warn`, and `console.error` output.
- Inspect uncaught runtime errors and unhandled promise rejections.
- Clear captured console output independently from the HTML editor.
- Load externally referenced styles, images, and scripts when allowed by their servers.
- Keep preview code isolated from the JSON Toolbox page and its origin.

### Convert SQL tables

The dedicated **SQL Converter** tab parses a `CREATE TABLE` statement into a shared table model and generates:

- **C# EF Core entity** classes with `[Table]`, `[Key]`, `[Required]`, `[MaxLength]`, `[Column]`, and identity-generation attributes.
- **C# models** as clean POCO classes without Entity Framework mapping attributes.
- **TypeScript DTOs** as exported interfaces, with nullable SQL columns represented as optional `| null` properties.
- **Dart models** with constructors plus `fromJson` and `toJson` methods.

The parser recognizes schema-qualified and quoted table names, common SQL types, nullability, inline or table-level primary keys, identity columns, unique columns, defaults, lengths, and decimal precision.

SQL-generated field names use the same selectable language-default, camelCase, PascalCase, and snake_case formatting modes as JSON conversion. Original database column names remain unchanged inside EF Core `[Column]` mappings and serialization keys.

Select the source database dialect before converting:

- **SQL Server:** brackets, `IDENTITY`, `DATETIME2`, `UNIQUEIDENTIFIER`, `ROWVERSION`, and SQL Server date/binary behavior.
- **PostgreSQL:** quoted identifiers, `SERIAL` types, `GENERATED AS IDENTITY`, `TIMESTAMPTZ`, `BYTEA`, `UUID`, `JSONB`, and character-varying types.
- **MySQL:** backtick identifiers, `AUTO_INCREMENT`, unsigned numeric types, `TINYINT(1)` booleans, and MySQL date types.
- **Oracle:** quoted identifiers, `NUMBER`, `VARCHAR2`, `NVARCHAR2`, `CLOB`, `BLOB`, `DATE`, timestamp-with-time-zone types, and Oracle identity columns.

## Technology

- React 18
- TypeScript with strict type checking
- Vite 5
- Tailwind CSS 3
- Ajv 8
- Lucide React icons
- Vercel Web Analytics

## Getting started

### Requirements

- Node.js
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:5173>.

### Production build

```bash
npm run typecheck
npm run build
npm run preview
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run typecheck` | Run strict TypeScript checks without emitting files. |
| `npm run build` | Generate an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for verification. |

## Development workflow

Repository-specific coding and verification rules are documented in [`AGENTS.md`](AGENTS.md).

Every pull request and push to `main` runs the GitHub Actions workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). CI installs dependencies from `package-lock.json`, runs strict TypeScript checks, and creates the production build on Node.js 20.

Before opening a pull request, run:

```bash
npm run typecheck
npm run build
git diff --check
```

## How to use

1. Paste JSON into the input editor.
2. Select **Beautify**, **Minify**, **Stringify**, or **Convert** for a generated output.
3. Select **Tree** to explore the current input recursively.
4. Select **Diff**, paste the original and modified documents, and press **Compare JSON**.
5. Select **Schema**, paste JSON data and a schema, and press **Validate JSON**.
6. Switch to the **HTML Viewer** tab and paste markup to render it in the live preview.
7. Switch to the **SQL Converter** tab, paste one `CREATE TABLE` statement, choose an output, and press **Convert SQL**.

Invalid JSON is shown inline with the native parser message and, when available, its line and column.

## Project structure

```text
.
|-- index.html                    # Browser entry document
|-- package.json                  # Dependencies and npm scripts
|-- tsconfig.json                 # Strict TypeScript configuration
|-- vite.config.ts                # Vite, React, and PostCSS configuration
|-- tailwind.config.ts            # Tailwind content and theme configuration
`-- src/
    |-- App.tsx                   # Top-level application composition
    |-- main.tsx                  # React DOM entry point
    |-- types.ts                  # Shared JSON and toolbox domain types
    |-- index.css                 # Tailwind directives and editor styling
    |-- vite-env.d.ts             # Vite client type declarations
    |-- pages/
    |   `-- JsonToolboxPage.tsx   # Main mode and panel layout
    |-- hooks/
    |   |-- useJsonToolbox.ts     # JSON and HTML state and action handlers
    |   `-- useSqlConverter.ts    # SQL converter state and generation workflow
    |-- components/
    |   |-- AppShell.tsx          # Responsive application frame
    |   |-- Header.tsx            # Title and byte/change statistics
    |   |-- WorkspaceTabs.tsx     # JSON and HTML workspace navigation
    |   |-- Toolbar.tsx           # Tool, view, target, and run controls
    |   |-- InputPanel.tsx        # Labeled JSON editor panel
    |   |-- JsonEditor.tsx        # Editable syntax-highlighted JSON surface
    |   |-- JsonHighlight.tsx     # JSON tokenizer and read-only renderer
    |   |-- OutputPanel.tsx       # Transform and conversion output container
    |   |-- CodeOutput.tsx        # Generated-code syntax highlighting
    |   |-- TreeView.tsx          # Tree parsing and expand/collapse controls
    |   |-- TreeNode.tsx          # Recursive JSON tree node
    |   |-- DiffResult.tsx        # Split diff renderer
    |   |-- SchemaResult.tsx      # Schema validation result list
    |   |-- HtmlPreview.tsx       # Sandboxed HTML editor and live preview
    |   |-- SqlConverter.tsx      # SQL input and generated model workspace
    |   |-- ErrorPanel.tsx        # Shared parsing and processing error display
    |   |-- PanelHeader.tsx       # Shared panel title bar
    |   `-- IconButton.tsx        # Shared icon-only button
    `-- utils/
        |-- jsonTools.ts          # Formatting, diffing, validation, and tree helpers
        |-- codeGenerators.ts     # Dart, JavaScript, and C# generators
        |-- splitDiff.ts          # Line diff and split-row alignment algorithm
        |-- sqlParser.ts          # CREATE TABLE parser and table model builder
        |-- sqlGenerators.ts      # EF Core, C#, TypeScript DTO, and Dart generators
        `-- sampleJson.ts         # Initial editor example
```

## Architecture

The project keeps processing logic separate from React rendering:

- `useJsonToolbox.ts` owns editor state, active mode, and user actions.
- `jsonTools.ts`, `codeGenerators.ts`, and `splitDiff.ts` contain pure or reusable processing functions.
- `types.ts` defines shared actions, JSON values, errors, diff changes, and schema results.
- Page and component modules are responsible for layout and presentation.

This separation makes processing utilities easier to test and allows UI components to remain focused.

## Extending the toolbox

### Add a toolbar action

1. Add the action name to `ToolboxAction` in `src/types.ts`.
2. Implement its processing function under `src/utils/`.
3. Add its state and handler to `src/hooks/useJsonToolbox.ts`.
4. Add the action control to `src/components/Toolbar.tsx`.
5. Render its mode or output in `src/pages/JsonToolboxPage.tsx`.

### Add a conversion target

1. Extend `ConvertTarget` in `src/types.ts`.
2. Implement the generator in `src/utils/codeGenerators.ts`.
3. Add the target option to `src/components/Toolbar.tsx`.

### Add reusable UI

Place shared visual components in `src/components/` and keep domain processing in `src/utils/` where possible.

## Current behavior and limitations

- Diff arrays are compared by position; moved array items may appear as removals and additions.
- Code generation infers types from the values present in the sample JSON.
- Empty or mixed-type arrays provide limited type information to code generators.
- Clipboard access depends on browser permissions and a secure browser context.
- JSON Schema support follows the Ajv configuration used in `src/utils/jsonTools.ts`.
- HTML previews run in a sandboxed iframe with scripts enabled but without same-origin access.
- External preview resources still depend on network availability and their server security policies.
- SQL conversion currently accepts one `CREATE TABLE` statement and supports a practical subset of SQL Server, PostgreSQL, MySQL, and Oracle DDL.
- Foreign keys, indexes, computed columns, and database relationships are not generated yet.
- Generated EF Core entities are a starting point; application-specific navigation properties and validation rules may still be required.

## License

See [LICENSE](LICENSE).
