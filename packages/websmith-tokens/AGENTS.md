# Websmith Tokens Guide

## Mission
Maintain design tokens that feed the UI, theme, and downstream consumers. Treat this directory as the single source of truth for visual primitives.

## Authoring Rules
- Organize tokens by domain (`colors/`, `spacing/`, `typography/`, etc.) and re-export through `src/index.ts`.
- Keep values serializable to multiple formats; avoid runtime-dependent logic.
- Use consistent naming (kebab-case for JSON exports, camelCase for TypeScript constants).

## Build & Validation
- `npm run build -- --filter=packages/websmith-tokens` to regenerate `dist/` bundles.
- Add or update snapshot tests under `src/__tests__/` to guard against regressions.
- Run `npm run lint -- --filter=packages/websmith-tokens` and `npm run typecheck -- --filter=packages/websmith-tokens` before merging.

## Collaboration Notes
- Notify `websmith-theme` and `websmith-ui` owners when token names or semantics change.
- Document token additions in `apps/docs` with usage examples.
- Avoid breaking changes without plan for gradual migration; leverage token aliases when deprecating.

## Release Checklist
- Create a Changeset describing the token update and impacted packages.
- Validate that consuming apps rebuild without warnings after running `npm install`.
