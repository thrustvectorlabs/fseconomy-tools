# README

FSEconomy Tools (FSET) provides unofficial enhancements for FSEconomy (`server.fseconomy.net`).

# FSE Tools Homepage

- [FSE Tools website and installation instructions](https://thrustvectorlabs.github.io/fseconomy-tools/)

# Local development

These steps are only needed if you want to run a local version of FSE Tools.

- Set up the project:

```bash
pnpm install
```

- Run `pnpm build` to create `dist/bundle.js` and `dist/fseconomy-tools.user.js`.
- Adjust `src/config.ts` if you want different default aircraft or airports for local development.
- For a local-only Tampermonkey install, create a new script, paste in `tampermonkey-script/script.js`, and replace the hosted `@require` URL with your local `dist/bundle.js` path.
- Then run `pnpm dev` to keep the bundle updated.

# GitHub release hosting

- `tampermonkey-script/script.js` auto-updates from `package.json`.
- Installed Tampermonkey updates should come from the latest release userscript asset:
  `https://github.com/thrustvectorlabs/fseconomy-tools/releases/latest/download/fseconomy-tools.user.js`
- `pnpm build` now generates both `dist/bundle.js` and `dist/fseconomy-tools.user.js`.
- Pushing a tag like `v0.7.1` triggers `.github/workflows/release-assets.yml`, which builds the project and uploads both files to the matching GitHub Release.
- The repo copy of the userscript points `@require` at the latest hosted bundle:
  `https://github.com/thrustvectorlabs/fseconomy-tools/releases/latest/download/bundle.js`
- The released `fseconomy-tools.user.js` asset is rewritten during build to point at its matching tagged bundle, so each published userscript loads the correct release payload.

# About

This is an older project I had on the shelf that I decided to dust off and publish on GitHub.
I built it because I enjoy FSEconomy (FSE). Of the career simulation platforms available for flight simulators, especially in the MSFS2020 era and beyond, FSEconomy still fits what I want best. At the same time, I have a long wishlist for areas where the site could be improved as it continues to show its age. FSEconomy Tools adds a few of those improvements:

- **Airport Dispatcher on airport pages.** FSEconomy Tools adds a compact Airport Dispatcher panel to the airport page with dispatch summaries, map links, and quick access to nearby opportunities.
- **SimBrief integration.** SimBrief delivers an advanced flight‑planning tool in an accessible format for flight simmers. FSEconomy Tools adds a link on the **My Flight** page to create a SimBrief flight plan based on the flight you have selected.
- **MSFS coordinate validation.** Airport pages include checks and helpers for airport coordinates, making it easier to compare FSEconomy airport data with MSFS and copy coordinates into the simulator. This helps prevent your aircraft from getting stuck at a non-existent airport.

## PRs welcome

PRs are welcome. The tech stack is strict TypeScript, with React and Zustand for state management. Keep PRs small, and feel free to open an issue first if you want to discuss an idea.

## Upcoming features

- Calculate and display net income when selecting a group of assignments
- Make a standalone version that can be loaded directly into Tampermonkey from a remote source

## What FSEconomy Tools is _not_:

- A tool that takes over FSEconomy. The site's native behavior stays the same. If FSEconomy Tools adds something to the website, it is clearly marked with the FSEconomy Tools badge.

### Reference links:

- FSEconomy Operations Guide: https://sites.google.com/site/fseoperationsguide/introduction
  - Assignments section: https://sites.google.com/site/fseoperationsguide/getting-started/assignments
- All SimBrief parameters: https://www.simbrief.com/forum/viewtopic.php?f=6&t=6&sid=95057b3e8d565e52c5e353d0df29aeea
