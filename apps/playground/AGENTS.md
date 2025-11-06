# Playground App Guide

## Mission
Maintain the interactive Next.js sandbox used for manual QA of design-system components.

## Core Duties
- Organize demo routes under `app/` by component family; mirror package export names.
- Sync dependency versions with `packages/websmith-ui` to avoid drift.
- Keep sample data small and deterministic so snapshots remain stable.

## Running Locally
- `npm run dev -- --filter=playground` for iterative testing.
- `npm run build -- --filter=playground && npm run start -- --filter=playground` to simulate production.
- Use `npm run lint -- --filter=playground` before shipping UI changes.

## Testing & QA
- Capture new interactions via Storybook-like pages instead of screenshots.
- Validate components against `@testing-library/react` examples when adding complex logic.
- Record any known gaps in `TASKS.md` so follow-up work stays visible.

## Deployment Checklist
- Ensure all external assets load via HTTPS and provide fallbacks.
- Remove experimental routes once components graduate to docs.
- Coordinate with docs team when props or theming APIs change.
