# Docs App Guide

## Mission
Own the Nextra-powered documentation site served from `apps/docs`. Keep guides current and ensure static export stays clean.

## Daily Tasks
- Write content in `pages/` using MDX. Use frontmatter for sidebar metadata.
- Adjust theme tokens via `theme.config.tsx` to sync with the design system.
- Maintain navigation and landing experience in `app/` when overriding defaults.

## Build & Preview
- `npm run dev -- --filter=docs` for local authoring.
- `npm run build -- --filter=docs` to validate static export; confirm output in `out/`.
- Run `npm run lint -- --filter=docs` before commit to catch MDX/Next issues.

## Content Standards
- Prefer concise, component-driven examples referencing `@websmith/ui`.
- Document new primitives concurrently with changesets in `packages`.
- Store diagrams in `public/` or remote URLs; never commit large binaries.

## Release Checklist
- Update `ERD.md`, `PRD.md`, or other root docs when relevant sections change.
- Confirm `vercel.json` rewrites still match the latest routes.
- After a major update, provide a changelog link in `FINAL_ENHANCEMENT_REPORT.md`.
