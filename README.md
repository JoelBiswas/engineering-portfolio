# Joel Biswas — Engineering Portfolio

React/Tailwind portfolio presenting five engineering projects: a RISC-V processor, R2-D2 droid, RF controller, axial-flux motor, and AMBU-bag compression prototype.

## Preview and build

```sh
npm ci
npm start
npm run build
```

Use Node.js 22 or later. Production output is in `build/`. These commands do not publish anything or fetch replacement project copy from GitHub.

## Curated project stories

`src/components/projectContent.json` is the source of the project titles, subtitles, and information sections. Each project has a short recruiter-facing introduction followed by sections covering the design, engineering decisions, process, and outcomes. Project-specific headings keep the stories relevant to the work rather than following a repository's file structure.

Each section has a `heading` and a `body` array of text lines. Blank lines separate paragraphs; the existing renderer supports inline emphasis, lists, links, and tables. Images remain in the galleries. `Projects.jsx` controls card order, images, tags, and technologies.

The copy was grounded in the saved project READMEs and design journals. It distinguishes documented design work and simulation results from measured hardware performance. Club-provided components are credited in the processor story. Project stories should be deliberately updated as new results become available.

## Optional reference refresh

The previous README-fetching tool is retained only for refreshing background reference material:

```sh
npm run sync:readmes
```

It writes to `src/components/projectReadmes.json`, which is not imported by the website. It cannot overwrite the curated stories in `projectContent.json`. Neither local startup nor production builds invoke it automatically.

## Preview workflow

`.github/workflows/portfolio-preview.yml` is manual-only. It runs the UI tests, builds the site, and uploads a `portfolio-preview` artifact. It has no schedule and does not commit, push, or deploy anything. Publishing remains a separate action.

## Verification

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

The optional reference-fetching tool has its own tests:

```sh
npm run test:readme-sync
```

## Assets and contact

Project photos and CAD renders are bundled in `public/images/engineering/`. Gallery configuration is in `src/components/projectGalleries.json` and `Projects.jsx`. Skill cards use local illustrations and brand logos with local fallbacks. Asset sources are recorded in `IMAGE-SOURCES.json`.

The contact form retains the portfolio's EmailJS configuration. No real email is sent during verification.
