# Websmith UI Guide

## Mission
Deliver production-ready React components that match the design system. Prioritize accessibility, theming, and TypeScript ergonomics.

## Development Flow
- Implement components under `src/components/` with colocated stories/tests.
- Export public APIs through `src/index.ts`; keep breaking changes behind major version bumps.
- Leverage Tailwind utility maps for variants; store shared styles in `src/styles/` if needed.
- Author Storybook stories (`*.stories.tsx`) alongside components and keep examples focused on primary variants.

## Quality Gates
- Run `npm run test -- --filter=packages/websmith-ui` for Vitest suites.
- Execute `npm run lint -- --filter=packages/websmith-ui` and `npm run build -- --filter=packages/websmith-ui` before PRs.
- Add snapshots or interaction tests when introducing new props or states.
- Validate visuals locally with `npm run storybook` (monorepo root) and rely on Chromatic (see workflow) for regression detection.

## Accessibility & UX
- Use `@testing-library/react` patterns to verify keyboard support and ARIA attributes.
- Provide sensible defaults and avoid hard-coded colors—source tokens from `@websmith/tokens`.
- Document usage examples for docs/playground teams in code comments or MDX snippets.

## Release Checklist
- Update or add a Changeset entry capturing the component changes.
- Regenerate types by running the build; confirm `dist/index.d.ts` matches expectations.
- Coordinate with docs to refresh component guides and with playground to demo new variants.
- Ensure Chromatic build is green; if snapshot changes are intentional, update the PR summary with reviewer guidance.
