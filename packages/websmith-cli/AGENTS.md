# Websmith CLI Guide

## Mission
Deliver developer tooling that streamlines setup, token management, and build workflows for Websmith consumers.

## Code Organization
- CLI entry lives in `src/index.ts`; individual commands reside under `src/commands/`.
- Keep command files focused: parsing, execution logic, and shared helpers separated for testability.
- Ensure each command exposes descriptive `--help` text and safe defaults.

## Development Commands
- `npm run dev -- --filter=packages/websmith-cli` (tsup watch) for rapid iteration.
- `npm run build -- --filter=packages/websmith-cli` to produce distributable binaries.
- `npm run lint -- --filter=packages/websmith-cli` and `npm run typecheck -- --filter=packages/websmith-cli` before commits.

## Testing Expectations
- Add unit tests for command handlers; mock filesystem or network calls where required.
- Verify CLI behavior by running `node dist/index.js <command>` after builds.
- Document breaking behavior changes in the command’s docstring and PR notes.

## Release Guidelines
- Introduce new commands behind feature flags when feasible.
- Update docs and playground to reflect CLI-generated output (templates, tokens).
- Publish via Changesets; confirm semantic versioning reflects impact.
