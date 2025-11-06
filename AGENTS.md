# Repository Guidelines

## Agent Directory
- `apps/` – front-end surfaces; see `apps/AGENTS.md` plus child guides for docs and playground.
- `packages/` – publishable libraries; consult `packages/AGENTS.md` and package-specific guides.
- `docs` & `tasks` – cross-team knowledge bases (`ERD.md`, `PRD.md`, `TASKS.md`); keep in sync with code updates.

## Project Structure & Module Organization
Websmith Kit is a Turborepo monorepo. `apps/docs` powers the Nextra documentation site (static export to `out/`), while `apps/playground` offers a QA sandbox. The `packages` directory hosts UI components, Tailwind presets, design tokens, and CLI tooling. Shared configs (`tsconfig.base.json`, `eslint.config.js`, `vitest.config.ts`) stay at the root so workspaces compile the same way.

## Build, Test, and Development Commands
- `npm run dev` – Calls `turbo dev`; scope via `--filter=<workspace>` when focusing on a single app or package.
- `npm run build` – Runs the Turbo build pipeline, emitting `.next/` or `dist/` artifacts.
- `npm run lint`, `npm run typecheck` – Apply ESLint and TypeScript rules across all workspaces.
- `npm run test` – Executes Vitest in `jsdom` mode; add `--watch` while iterating.
- `npm run storybook` / `npm run build-storybook` – Serve or statically export the UI component catalog from `packages/websmith-ui`.
- `npm run chromatic` – Builds Storybook then uploads to Chromatic; requires `CHROMATIC_PROJECT_TOKEN`.

## Coding Style & Naming Conventions
Default to `.ts`/`.tsx`. Prettier enforces two-space indentation, semicolons, single quotes, 80-character lines, and trailing commas. Use PascalCase for React components, camelCase for helpers, and colocate tests as `<name>.test.tsx`. Favor Tailwind class maps or helpers over inline string concatenation for variants.

## Testing Guidelines
Use Vitest with Testing Library helpers and `@testing-library/jest-dom` assertions. Add at least one behavior test for every new component path. For tokens or theming changes, include snapshot/rendering coverage. Validate UI changes in Storybook and rely on the Chromatic pipeline for visual regressions. Keep `npm run test` green before requesting review and note untested areas in the PR body.

## Commit & Pull Request Guidelines
Follow Conventional Commit prefixes (`feat:`, `fix:`, `docs:`) and imperative tone. Squash WIP commits locally. PRs should explain intent, list verification steps, and link issues. Provide screenshots or playground URLs for UI updates. Run lint, typecheck, test, and record Changesets (`npx changeset`) when altering publishable packages.
