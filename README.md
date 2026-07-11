# JSON Toolbox

JSON Toolbox is a browser-based collection of utilities for formatting, exploring, comparing, validating, and converting JSON. It is built with React, strict TypeScript, Vite, and Tailwind CSS.

All JSON processing happens locally in the browser. The application does not upload editor content to a server.

## Features

### Format and transform

- **Beautify** parses JSON and formats it with readable indentation.
- **Minify** removes unnecessary whitespace and reports the size reduction.
- **Stringify** converts the editor contents into an escaped JSON string literal.
- **Copy output** writes generated output to the clipboard.
- **Swap output** moves JSON output back into the input editor.
- **Clear** resets the current workspace.

### Convert JSON to code

Generate typed structures from representative JSON data:

- Dart model classes with `fromJson` and `toJson` methods
- JavaScript DTO classes with JSDoc property definitions
- C# entity classes

The root class name can be changed before generating code. Nested objects and arrays of objects generate additional classes.

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
- Run embedded JavaScript inside an isolated iframe sandbox.
- Load externally referenced styles, images, and scripts when allowed by their servers.
- Keep preview code isolated from the JSON Toolbox page and its origin.

## Technology

- React 18
- TypeScript with strict type checking
- Vite 5
- Tailwind CSS 3
- Ajv 8
- Lucide React icons

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

## How to use

1. Paste JSON into the input editor.
2. Select **Beautify**, **Minify**, **Stringify**, or **Convert** for a generated output.
3. Select **Tree** to explore the current input recursively.
4. Select **Diff**, paste the original and modified documents, and press **Compare JSON**.
5. Select **Schema**, paste JSON data and a schema, and press **Validate JSON**.
6. Switch to the **HTML Viewer** tab and paste markup to render it in the live preview.

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
    |   `-- useJsonToolbox.ts     # Application state and action handlers
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
    |   |-- ErrorPanel.tsx        # Shared parsing and processing error display
    |   |-- PanelHeader.tsx       # Shared panel title bar
    |   `-- IconButton.tsx        # Shared icon-only button
    `-- utils/
        |-- jsonTools.ts          # Formatting, diffing, validation, and tree helpers
        |-- codeGenerators.ts     # Dart, JavaScript, and C# generators
        |-- splitDiff.ts          # Line diff and split-row alignment algorithm
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

## License

See [LICENSE](LICENSE).
