# JSON Toolbox

A small React + Vite app for working with JSON: beautify, minify, stringify,
and explore JSON in an interactive tree view.

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
|-- App.jsx                  # App composition
|-- main.jsx                 # React entry point
|-- index.css                # Tailwind directives
|-- components/
|   |-- AppShell.jsx         # Centered application frame
|   |-- Header.jsx           # Title bar and size stats
|   |-- Toolbar.jsx          # Action buttons, indent selector, view toggle
|   |-- PanelHeader.jsx      # Shared panel title row
|   |-- IconButton.jsx       # Shared icon-only button styles
|   |-- InputPanel.jsx       # Raw JSON input
|   |-- OutputPanel.jsx      # Text output panel
|   |-- ErrorPanel.jsx       # Shared invalid-JSON error display
|   |-- TreeView.jsx         # Tree view container
|   `-- TreeNode.jsx         # Recursive tree node renderer
|-- hooks/
|   `-- useJsonToolbox.js    # JSON toolbox state and actions
|-- pages/
|   `-- JsonToolboxPage.jsx  # Page-level layout for the toolbox
`-- utils/
    |-- jsonTools.js         # Pure JSON helpers
    `-- sampleJson.js        # Default editor content
```

## Features

- Beautify: pretty-print with 2 or 4-space indent
- Minify: collapse to a single line and show size reduction
- Stringify: wrap the raw input as an escaped JSON string literal
- Convert JSON to Dart models, JavaScript DTO classes, or C# entity classes
- Tree view: collapsible, color-coded tree for parsed input
- Inline invalid JSON errors with line and column
- Copy-to-clipboard and swap-output-into-input

## Extension points

- Add a new screen under `src/pages/` and mount it from `App.jsx`.
- Add new JSON actions in `src/utils/jsonTools.js`, then expose them through
  `src/components/Toolbar.jsx` and `src/hooks/useJsonToolbox.js`.
- Add or refine code generators in `src/utils/codeGenerators.js`.
- Add reusable visual pieces under `src/components/`.
