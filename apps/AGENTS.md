# Apps Workspace Guide

## Mission
Coordinate all application front-ends. Use this guide to decide whether work belongs in docs, playground, or supporting config.

## Sub-Agent Handoff
- `apps/docs/AGENTS.md` – production documentation site (Nextra).
- `apps/playground/AGENTS.md` – interactive QA sandbox.
Escalate Only when tasks span both apps (shared dependencies, Turbo filters).

## Key Tasks
- Maintain shared Next.js configuration inside each app’s `next.config.mjs`.
- Keep workspace dependencies in sync with the root `package-lock.json`.
- Ensure asset pipelines output to `out/` (docs) or `.next/` (playground) without committing build artifacts.

## Useful Commands
- `npm run dev -- --filter=docs` or `--filter=playground` to boot a single app.
- `npm run build -- --filter=apps/...` to test production builds locally.
- `npm run lint -- --filter=apps/...` for app-scoped linting.

## Quality Checklist
- No stray environment secrets committed; use `.env.local` ignored files.
- Verify links and imports stay workspace-relative (no `../../../` leaps into packages).
- Update `README` or `docs` nav when adding new app-level pages.
