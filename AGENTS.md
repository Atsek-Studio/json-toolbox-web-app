# Repository Rules

These instructions apply to the entire repository.

## User approval policy

These rules take priority over the normal development workflow in this file:

- Never create a Git commit, amend a commit, push a branch, open a pull request, or publish changes unless the user explicitly requests that exact action.
- Do not run shell commands, package scripts, builds, type checks, tests, formatters, development servers, installers, or other executable tools unless the user explicitly approves running them.
- Read-only file inspection is allowed only when needed to understand a request. Prefer direct file-reading tools and avoid executing project code for inspection.
- Small, focused file edits requested by the user may be implemented directly.
- Before a big change, stop and provide a reviewable proposal. Do not implement until the user approves the scope.
- Treat a change as big when it does one or more of the following:
  - modifies multiple features or workspaces;
  - changes architecture, shared types, state ownership, routing, security boundaries, or public behavior;
  - adds, removes, or upgrades dependencies;
  - changes build, TypeScript, Tailwind, Vite, CI, deployment, or package-manager configuration;
  - performs a broad refactor, file migration, or large generated rewrite;
  - changes SQL parsing/generation across multiple dialects or output targets;
  - could cause data loss, security impact, or difficult rollback.
- A big-change proposal must include:
  - the intended outcome;
  - files expected to change;
  - important design decisions and tradeoffs;
  - risks and compatibility concerns;
  - commands that would be run after approval;
  - a clear request for approval before implementation.
- After implementing an approved big change, summarize the exact files and behavior changed so the user can review them. Do not commit the result.

## Project overview

JSON Toolbox is a client-only React application with three independent workspaces:

- JSON Toolbox: formatting, conversion, tree exploration, semantic diff, and JSON Schema validation.
- HTML Viewer: sandboxed HTML execution with live/manual refresh and captured console output.
- SQL Converter: dialect-aware `CREATE TABLE` parsing and C#, TypeScript, and Dart generation.

The application uses React 18, strict TypeScript, Vite 5, Tailwind CSS 3, Ajv, and Lucide icons. Processing must remain local to the browser unless a feature explicitly requires otherwise.

## Required commands

After the user explicitly approves command execution, run these commands before completing code changes:

```bash
npm run typecheck
npm run build
git diff --check
```

When processing logic changes, also run focused examples that cover the changed behavior. There is not yet a repository test runner; prefer adding Vitest tests when introducing enough logic to justify one.

## TypeScript rules

- Keep all project source and configuration in `.ts` or `.tsx`; do not add `.js` or `.jsx` files.
- Preserve strict TypeScript compatibility. Do not use `any` to bypass errors.
- Define domain types in `src/types.ts` when they are shared by multiple modules.
- Use `import type` for type-only imports.
- Narrow `unknown` errors with `instanceof Error` or a dedicated helper.
- Keep React props explicitly typed with an interface or a clear inline type.
- Use extensionless local imports, matching the current bundler configuration.

## Architecture and file placement

- Keep orchestration and workspace layout in `src/pages/`.
- Keep React state workflows in `src/hooks/`.
- Keep reusable presentation in `src/components/`.
- Keep parsers, generators, tokenizers, validation, and diff algorithms in `src/utils/`.
- Prefer pure utility functions for transformations so they can be tested independently.
- Split a component or utility when it starts mixing unrelated parsing, state, and rendering responsibilities.
- Update `README.md` whenever a user-facing feature, script, dependency, dialect, output target, or limitation changes.

## UI conventions

- Follow the existing dark neutral palette with teal for active/success states, red for errors/removals, green for additions, and amber for warnings.
- Use Tailwind utility classes and existing shared components before introducing new CSS.
- Use Lucide icons already available through `lucide-react`.
- Preserve responsive behavior: split editors stack on small screens and display side by side from the `md` breakpoint.
- Provide accessible labels for editors and icon buttons.
- Use `aria-pressed`, `aria-selected`, and appropriate roles for selectable controls.
- Do not erase another workspace's state when clearing or changing the active tab.
- Generated output must offer clear empty, success, error, and copy states.

## JSON workspace rules

- Keep raw JSON parsing and processing in `src/utils/jsonTools.ts` or a focused utility.
- Return structured `ToolboxError` values instead of throwing errors into React components.
- Preserve line and column details for JSON parse errors when available.
- JSON diff is semantic: object key order and whitespace are ignored; arrays are compared by index unless an explicit option changes that behavior.
- Changing diff or schema input must invalidate stale results.
- JSON-to-code targets are declared through `ConvertTarget`; update the type, toolbar, generator, README, and focused checks together.
- JSON samples cannot reliably reveal whether non-null properties are optional. Do not invent optionality without documenting a convention or adding a user option.

## HTML Viewer security rules

- Render user HTML only through the sandboxed iframe in `HtmlPreview.tsx`.
- Do not add `allow-same-origin` to the iframe sandbox. Combining it with `allow-scripts` would weaken isolation.
- Treat preview messages as untrusted. Accept console messages only when:
  - `event.source` is the active iframe window;
  - the payload passes `isPreviewConsoleMessage`;
  - the payload preview ID matches the current preview.
- Keep the console bridge in `src/utils/htmlPreview.ts`, not inline in the component.
- Ensure console serialization tolerates circular objects, errors, and non-JSON values.
- Preserve Live and Manual modes. Live updates should remain debounced so scripts do not rerun on every keystroke.
- Cap retained console entries to avoid unbounded memory growth.

## SQL Converter rules

- SQL conversion follows this pipeline: DDL text → `SqlTable`/`SqlColumn` model → target generator.
- Do not generate directly from unparsed SQL strings.
- Always pass the selected `SqlDialect` into `parseCreateTable`.
- Supported dialects are SQL Server, PostgreSQL, MySQL, and Oracle.
- When adding SQL syntax or a data type, consider all four output targets:
  - C# EF Core entity;
  - plain C# model;
  - TypeScript DTO;
  - Dart model.
- Preserve dialect-specific meaning, especially identity syntax, quoted identifiers, binary/timestamp behavior, nullable types, precision, scale, and string lengths.
- SQL Server `TIMESTAMP`/`ROWVERSION` are binary concurrency values, not date-time values.
- Oracle `DATE` includes time and maps differently from a date-only SQL type.
- MySQL `TINYINT(1)` is treated as boolean by the current convention.
- PostgreSQL and Oracle timestamp-with-time-zone types map to offset-aware C# values.
- Changing dialect or SQL input must clear stale generated output without deleting the user's SQL.
- Never let React click events flow into conversion target parameters; UI callbacks must call typed conversion functions explicitly.
- For parser changes, check representative DDL from every affected dialect, including quoting, nullability, identity, primary keys, and parameterized types.

## Generated-code conventions

- Generated type and property names use PascalCase for C# types/properties and camelCase for TypeScript/Dart fields.
- C# EF entities retain database column names and SQL types through mapping attributes.
- Plain C# models must not contain Entity Framework mapping attributes.
- Nullable SQL columns map to nullable C# types and optional nullable TypeScript properties.
- TypeScript DTO output uses `export interface` rather than JavaScript classes.
- Dart output includes a constructor plus `fromJson` and `toJson` methods.
- Keep generated output deterministic so the same input and options produce identical text.

## Dependency and configuration rules

- Use npm as the canonical package manager; `package-lock.json` is authoritative.
- Do not hand-edit lockfiles.
- Add dependencies only when the functionality cannot be implemented safely and maintainably with existing packages.
- Keep PostCSS plugins configured through `vite.config.ts`; Vite 5 cannot reliably load the previous ESM TypeScript PostCSS config setup.
- Keep Tailwind's content glob aligned with `.ts` and `.tsx` source files.
- Do not weaken `tsconfig.json` strictness to make a change compile.

## Scope and safety

- Preserve unrelated user changes and untracked files.
- Avoid broad rewrites when a focused change is sufficient.
- Do not silently remove supported conversion targets or dialect behavior.
- Document intentional limitations rather than pretending unsupported syntax is fully handled.
