# Websmith Theme Guide

## Mission
Expose Tailwind CSS presets and shared theming utilities consumed by apps and components.

## Development Priorities
- Author sources in `src/` (`index.ts`, `presets.ts`, `theme.ts`); keep exports tree-shakeable.
- Reflect design token updates by importing from `@websmith/tokens` instead of duplicating values.
- Maintain backwards compatibility for preset names and utility hooks.

## Tooling
- `npm run build -- --filter=packages/websmith-theme` to generate `dist/`.
- `npm run lint -- --filter=packages/websmith-theme` and `npm run typecheck -- --filter=packages/websmith-theme` before publishing.
- Use `npm run dev -- --filter=packages/websmith-theme` (tsup watch) when iterating locally.

## Quality Checklist
- Verify generated `tailwind.config.js` snippets in consumers still compile.
- Add unit tests when introducing computed theme helpers; colocate under `src/__tests__/`.
- Update documentation snippets in `apps/docs` after modifying presets or tokens.

## Release Coordination
- Record a Changeset capturing preset additions or breaking changes.
- Communicate required Tailwind configuration changes to app owners through PR notes.
