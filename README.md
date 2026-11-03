# Joel Biswas — Engineering Portfolio

React/Tailwind engineering portfolio with separate RISC-V core, R2-D2, RF controller, axial-flux motor, and ventilator projects.

## Local preview and builds

Use Node.js 22 or later:

```sh
npm ci
npm start
npm run build
```

`npm start` and `npm run build` automatically refresh project content from the GitHub READMEs before starting. An already running preview does not poll GitHub; restart it or run the sync command to pick up later edits:

```sh
npm run sync:readmes
```

The preview reloads when the saved README data changes. Production output is in `build/`. Building does not publish the site.

## README synchronization

`scripts/sync-project-readmes.mjs` downloads `README.md` from each project's default branch. Repository URLs live in `src/components/projectReadmes.json`; that file also holds the last successful content snapshot.

The sync extracts the README's main title and first prose paragraph for the subtitle, then retains the Markdown for the information tabs. If a README has no introductory paragraph, the subtitle comes from the first section's prose. `ReadmeContent.jsx` continues to hide repository-overview sections, empty or placeholder sections, and images. Image-only tabs are omitted. The project cards use the subtitle's first sentence as their summary.

Galleries, images, tags, technologies, styling, and project order are maintained separately and are not changed by README sync.

Failed fetches or invalid README content retain the corresponding saved project snapshot and print a warning. For strict validation, which fails without writing any partial updates:

```sh
npm run sync:readmes -- --strict
```

For intentionally offline builds:

```sh
README_SYNC_OFFLINE=1 npm run build
```

The sync runs only during development/build tooling, so visitors do not make GitHub requests or wait for README downloads.

## Scheduled refresh — no deployment

`.github/workflows/refresh-project-content.yml` prepares a fresh build daily at 13:23 UTC or when manually triggered in GitHub Actions. It runs synchronization in strict mode and uploads the build and refreshed content as a `refreshed-portfolio-preview` artifact for seven days. It does not commit, push, or deploy anything.

This workflow is currently local and inactive. Its schedule becomes available after it is pushed to the repository's default branch. Publishing remains a separate action; this change does not update the live website automatically.

## Verification

```sh
npm run test:readme-sync
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

Sync tests exercise updated titles/headings, READMEs without introductory paragraphs, fetch failures, cache retention, and strict failure behavior without making network requests.

## Assets and contact

Project photos and CAD renders are bundled in `public/images/engineering/`. Gallery configuration is in `src/components/projectGalleries.json` and `Projects.jsx`. Skill cards use local illustrations and brand logos with local fallbacks. Asset sources are recorded in `IMAGE-SOURCES.json`.

The contact form retains the portfolio's EmailJS configuration. No real email is sent during verification.
