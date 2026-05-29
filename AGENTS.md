# AGENTS.md

## Repo purpose

- `fseconomy-tools` is a local TypeScript + React bundle that is loaded into FSEconomy through Tampermonkey.
- “FSET” refers to FSE Tools, meaning this `fseconomy-tools` project.
- The actual userscript metadata lives in [tampermonkey-script/script.js](/Users/sander/development/fseconomy-tools/tampermonkey-script/script.js).
- The compiled payload is `dist/bundle.js`, built from [src/index.tsx](/Users/sander/development/fseconomy-tools/src/index.tsx).

## Key areas

- Site-specific DOM augmentations live in [src/site-enhancers](/Users/sander/development/fseconomy-tools/src/site-enhancers).
- Airport page parsing used by the search UI lives in [src/fetchers/fetchDataFromAirport.ts](/Users/sander/development/fseconomy-tools/src/fetchers/fetchDataFromAirport.ts).
- Shared helpers belong in [src/utils](/Users/sander/development/fseconomy-tools/src/utils).

## Airport page notes

- FSEconomy’s airport page layout has changed from deeply nested table selectors to a structure centered around `.panel-body.airportInfo`.
- Current table anchors used elsewhere in the repo are `#acTable` for aircraft and `#jobTable` for assignments.
- Prefer text-based DOM detection over positional selectors on FSE pages. Labels like `Lat:` / `Long:` and `Elevation:` are more stable than `nth-child(...)`.
- The airport page requires an authenticated FSEconomy session. Unauthenticated fetches redirect to `/index.jsp`, so DOM changes usually need verification in a logged-in browser session.

## Commands

- Install: `pnpm install`
- Build: `pnpm build`
- Type check: `pnpm tsc`
- Test: `pnpm test`

## Working conventions

- Use `apply_patch` for edits.
- Prefer `rg` for code search.
- Keep enhancements additive. Do not break native FSE actions or form submissions.
- When touching site enhancers, avoid duplicate insertion by assigning a stable DOM id to injected UI.

## Example pages

- Only read example pages when explicitly asked to. The files are very big and may clutter the context window unnecessarily. The example pages are located in docs/example-pages/, which are mirrored copies of the original website.
