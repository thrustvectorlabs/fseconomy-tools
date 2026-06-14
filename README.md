# README

FSEconomy Tools (FSET) - unofficial enhancements for FSEconomy (server.fseconomy.net)

# FSE Tools Homepage via GitHub Pages

- The repo now includes a standalone landing page in `docs/`.
- Enable GitHub Pages in the repository settings and publish from the `main` branch, `/docs` folder.
- The landing page should stay focused on user-facing information:
  what FSET is, why someone would use it, and how to install it.
- Keep the actual script distribution on GitHub Releases:
  `https://github.com/thrustvectorlabs/fseconomy-tools/releases/latest/download/fseconomy-tools.user.js`

# Install

- Install the published userscript from:
  `https://github.com/thrustvectorlabs/fseconomy-tools/releases/latest/download/fseconomy-tools.user.js`
- Load FSEconomy while logged in and confirm the FSE Tools menu appears on the right.

# Local development

- Set up the project:

```bash
pnpm install
```

- Run `pnpm build` to create `dist/bundle.js` and `dist/fseconomy-tools.user.js`.
- Adjust `src/config.ts` if you want different default aircraft or airports for local development.
- For a local-only Tampermonkey install, create a new script and paste `tampermonkey-script/script.js`, then replace the hosted `@require` URL with your local `dist/bundle.js` path.

# To run locally:

`pnpm dev`

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

This is an old project I had laying on the shelf and decided to dust it off and publish it on GitHub.
This tooling was created because I love FSEconomy (FSE). Among the career simulations available for flight simulators (particularly MSFS2020 and later), FSEconomy best meets my needs. However, I still have a long wishlist for FSEconomy as it slowly gets outdated. FSEconomy Tools offers enhancements:

- **Airport Dispatcher on airport pages.** FSEconomy Tools adds a compact Airport Dispatcher panel to the airport page with dispatch summaries, map links, and quick access to nearby opportunities.
- **SimBrief integration.** SimBrief delivers an advanced flight‑planning tool in an accessible format for flight simmers. FSEconomy Tools adds a link on the **My Flight** page to create a SimBrief flight plan based on the flight you have selected.
- **Useful page enhancements.** FSEconomy Tools adds small quality-of-life improvements to pages like **Aircraft Log** and **FBOs For Sale** while keeping the original FSE workflows intact.
- **MSFS coordinate validation.** Airport pages include checks and helpers for airport coordinates so it is easier to compare FSEconomy airport data with MSFS and copy coordinates into the simulator. This should help preventing your aircraft from getting stuck at a non-existing airport.

## PRs welcome

FSET is welcoming PRs. Techstack is TypeScript (strict), with React and Zustand for state management. Keep PRs small and feel free to open an issue first to discuss.

## Upcoming features

- Calculate and display net income when selecting a group of assignments
- Make a standalone version which can be directly loaded from Tampermonkey from a remote source

## What FSEconomy Tools is _not_:

- A tool that takes over FS Economy. All behaviour of the website is still exactly the same. If FSEconomy Tools adds something to the website, it is clearly marked with the FSEconomy Tools badge.

### Reference links:

- FSEconomy Operations Guide: https://sites.google.com/site/fseoperationsguide/introduction
  - Assignments section: https://sites.google.com/site/fseoperationsguide/getting-started/assignments
- All SimBrief parameters: https://www.simbrief.com/forum/viewtopic.php?f=6&t=6&sid=95057b3e8d565e52c5e353d0df29aeea
