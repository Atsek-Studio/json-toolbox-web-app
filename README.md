# JSON Toolbox

A small React + Vite app for working with JSON: beautify, minify, stringify,
compare, and explore JSON in an interactive tree view.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL, typically `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
|-- App.tsx                  # App composition
|-- main.tsx                 # React entry point
|-- index.css                # Tailwind directives
|-- components/
|   |-- AppShell.tsx         # Centered application frame
|   |-- Header.tsx           # Title bar and size stats
|   |-- Toolbar.tsx          # Action buttons, indent selector, view toggle
|   |-- PanelHeader.tsx      # Shared panel title row
|   |-- IconButton.tsx       # Shared icon-only button styles
|   |-- InputPanel.tsx       # Raw JSON input
|   |-- OutputPanel.tsx      # Text output panel
|   |-- ErrorPanel.tsx       # Shared invalid-JSON error display
|   |-- TreeView.tsx         # Tree view container
|   `-- TreeNode.tsx         # Recursive tree node renderer
|-- hooks/
|   `-- useJsonToolbox.ts    # JSON toolbox state and actions
|-- pages/
|   `-- JsonToolboxPage.tsx  # Page-level layout for the toolbox
`-- utils/
    |-- jsonTools.ts         # Pure JSON helpers
    `-- sampleJson.ts        # Default editor content
```

## Features

- Beautify: pretty-print with 2 or 4-space indent
- Minify: collapse to a single line and show size reduction
- Stringify: wrap the raw input as an escaped JSON string literal
- Convert JSON to Dart models, JavaScript DTO classes, or C# entity classes
- Diff two JSON documents with added, removed, and changed JSONPath entries
- Validate JSON against JSON Schema with path-based error details
- Tree view: collapsible, color-coded tree for parsed input
- Inline invalid JSON errors with line and column
- Copy-to-clipboard and swap-output-into-input

## Extension points

- Add a new screen under `src/pages/` and mount it from `App.jsx`.
- Add new JSON actions in `src/utils/jsonTools.ts`, then expose them through
  `src/components/Toolbar.tsx` and `src/hooks/useJsonToolbox.ts`.
- Add or refine code generators in `src/utils/codeGenerators.ts`.
- Add reusable visual pieces under `src/components/`.
