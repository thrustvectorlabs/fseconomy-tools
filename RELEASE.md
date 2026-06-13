# Release Guide

This repo publishes Tampermonkey release assets through GitHub Releases.

## Release steps

1. Update `package.json` to the new version, for example `0.7.1`.
2. Commit the version change and push it to the branch you want to release from, usually `main`.
3. Open GitHub Releases and create a new release.
4. Create a new tag in the format `v<version>`, for example `v0.7.1`.
5. Set the target branch to the branch containing the version bump commit.
6. Publish the release.

## What happens on publish

- The GitHub Actions workflow in `.github/workflows/release-assets.yml` runs for tags matching `v*`.
- The workflow installs dependencies, runs tests, builds the bundle, and uploads release assets.
- The published GitHub Release receives:
  - `bundle.js`
  - `fseconomy-tools.user.js`

## Important requirements

- The GitHub tag must include the `v` prefix, for example `v0.7.1`.
- The version in `package.json` must match the tag version without the `v`, for example `0.7.1`.
- If those versions do not match, the generated userscript may point at the wrong hosted bundle.

## Hosted URLs used by Tampermonkey

- Userscript install/update URL:
  `https://github.com/thrustvectorlabs/fseconomy-tools/releases/latest/download/fseconomy-tools.user.js`
- Hosted bundle URL:
  `https://github.com/thrustvectorlabs/fseconomy-tools/releases/latest/download/bundle.js`

## Notes

- The repo copy in `tampermonkey-script/script.js` points at the `latest` release assets.
- The built release userscript is rewritten during the build so its `@require` points at the matching tagged `bundle.js`.
