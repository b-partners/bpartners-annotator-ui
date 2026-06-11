# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@bpartners/annotator-component` is a **publishable React component library** for rendering an image with editable polygon annotations on stacked HTML `<canvas>` layers. The public entry point is the `AnnotatorCanvas` component (see `README.md` for the consumer-facing props/types API).

The repo has two distinct trees:

- **`lib/`** — the library source. This is what gets compiled and published. All real code lives here.
- **`src/`** — a Vite dev playground (`src/App.tsx`) that imports `lib/` directly to exercise the component locally. **Not published** (`package.json#files` ships only `dist/`).

## Commands

```sh
npm run dev              # Vite dev server running src/App.tsx (the playground)
npm run build            # tsc (tsconfig-build.json) + vite build → dist/ (cjs, es, umd + .d.ts)
npm run lint             # eslint, --max-warnings 0 (warnings fail)
npm run prettier:check   # CI style gate
npm run prettier:write   # autofix formatting

npm run test:component   # Cypress component tests (headless)
npm run cy:open:component # Cypress interactive runner
# Run a single spec:
npx cypress run --component --spec "lib/__tests__/AnnotatorCanvas.cy.tsx"
```

Tests are **Cypress component tests** (not unit tests / jest), matched by `lib/__tests__/**/*.cy.{ts,tsx}`.

A `.env` providing `REACT_APP_ANNOTATOR_GEO_CONVERTER_API_URL` is needed for the playground's measurement feature (see Measurement flow below). Vite injects `process.env` via `define` in `vite.config.ts`.

## Release & commit conventions (important)

Releases are **automated from conventional commits**. The CI `publish-package.yml` workflow runs `conventional-changelog-action`, which bumps `version.yml`, syncs `package.json` via `.shell/update-version.sh`, updates `CHANGELOG.md`, and publishes to AWS CodeArtifact. Commit message prefixes (`fix:`, `feat:`, `release:`) directly determine the next version — follow them. The `husky` pre-commit hook runs `prettier:write` then `lint`.

## Architecture

### Provider nesting (state lives in React Context, not props)

`AnnotatorCanvas` is thin: it loads the image, then wraps everything in nested context providers, each owning one concern. Consume them via the matching `use*Context` hook rather than threading props:

```
ElementProvider   (containerRef + HTMLImageElement)
  └ SizesProvider     (canvas dimensions, scale, isMoving; writes scale to URL)
      └ PositionsProvider  (xRef/yRef for the cursor-position readout)
          └ PolygonProvider  (polygons, setPolygons, drawing refs, all feature flags)
              └ Canvas + TopBar
```

`PolygonProvider` holds the in-progress polygon and drawing flag as **refs** (`polygon`, `isDrawing`) so mid-draw mutations don't trigger re-renders; committed polygons flow up through the `setPolygons` callback prop.

### Three stacked canvases

`Canvas.tsx` renders three absolutely-positioned `<canvas>` layers, redrawn independently:
1. **image** (`use-draw-static-image`) — the base image
2. **polygon** (`use-draw-polygons`) — committed polygons
3. **cursor** (`use-cursor-polygon`, `use-mouse-down`) — live cursor, in-progress drawing, mouse events

### Imperative drawing via handler classes

DOM/canvas drawing and coordinate math are isolated in plain classes under `lib/utilities/` (`CanvasHandler`, `ScaleHandler`, `ImageInfoHandler`). Hooks instantiate these inside effects. The central concept is two coordinate spaces:
- **logical** = position in the original image's pixel space (what's stored in `Polygon.points`)
- **physical** = position on the scaled/scrolled canvas (what's drawn / what mouse events report)

`ScaleHandler` converts between them. When adding canvas behavior, do the geometry in a handler class, not inline in a component.

### Scale shared via the URL

Current zoom scale is stored as a `?scale=` **URL query param** (`UrlParams` in `lib/utilities/url-params.ts`), written by `SizesProvider` and read back by drawing/measurement code. This is a deliberate global side-channel — be aware that scale is *not* purely React state.

### Measurement (real-world dimensions) flow

When `polygonLineSizeProps.showLineSize` + a `converterApiUrl` are set, `use-measurement.ts` (debounced) maps polygons → GeoJSON (`mappers/`, `types/geojson.ts`), POSTs to the converter API (`provider/geojson-provider.ts`), and maps the response back into `Measurement[]` (line lengths in `m`, surfaces in `m²`). An optional `measurementMapper` prop lets consumers post-process. `Canvas.tsx` then renders the `m` labels as positioned `<span>`s overlaying the canvas.

### Barrel exports

Every directory has an `index.ts` re-exporting its contents, and `lib/index.ts` re-exports everything. Import from the nearest barrel (`from '..'` / `from '.'`) — this is the established convention throughout `lib/`.

## Peer dependencies

`react`, `react-dom`, `debounce`, `geolib`, `uuid` are **peerDependencies** (and `react`/`react/jsx-runtime` are externalized in the Vite lib build) — they are not bundled. Don't move them into regular dependencies.
