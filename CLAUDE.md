# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the binding rulebook (spec-before-code gate, product invariants, required feature surface, done criteria). Read it first; this file only adds orientation. If docs and code disagree, trust code and fix the docs.

## Commands

```bash
npm run dev              # Vite dev server
npm run build            # tsc -b && vite build
npm run typecheck        # tsc -b --noEmit
npm test                 # vitest run (70 tests, src/**/*.test.ts)
npm run test:e2e         # Playwright smoke test of the full studio flow (e2e/)
npx vitest run src/lib/colors.test.ts      # single file
npx vitest run -t "processColors"          # tests matching a name
npm run check:contrast   # WCAG AA check of theme tokens
npx impeccable detect src/                 # design anti-pattern scan, must return []
```

No linter is configured. Vitest runs in the `node` environment, so only pure logic in `src/lib/` is unit-tested. Anything touching `document`, canvas, or `createImageBitmap` (`pixelate.ts`, `image.ts`, `export.ts`, `convertBatch`) is not, and must be checked in the browser.

## Process rules

- Spec-driven: new features need specs in `docs/` approved by the user before implementation (see AGENTS.md). `docs/07-v2-spec.md` (touch-up tools, batch zip) and `docs/08-retro-presets-spec.md` (retro presets) are the latest scope additions; `docs/09-redesign-spec.md` defines the current visual world.
- Copy rules: no em-dashes anywhere in the codebase; user-facing brand is "beexie", never "Lanz0s".
- `scripts/check-contrast.cjs` hardcodes token hex values copied from `src/styles/tokens.css`. Change a color token, update both.
- `DESIGN.md` / `PRODUCT.md` and `.impeccable/` hold the design system and are maintained via the impeccable skill.

## Architecture

React 19 + TypeScript strict + Vite, zero runtime deps beyond React. Hand-written CSS in `src/styles/` (tokens in `tokens.css`, imported via `index.css`).

**App shell.** `App.tsx` switches between a `landing` view and the `studio` view, owns global drag/drop/paste, toasts, single download, and multi-file batch (2+ files → `convertBatch` → `pixel-batch.zip`). `main.tsx` deliberately omits `StrictMode`: its double mount would revoke the object URL / close the `ImageBitmap` held in state. Do not add it.

**State.** `hooks/useConverter.ts` is the single source of truth: `source`, `settings: ConverterSettings`, derived `grid` and `pixelSize`, `processed`, touch-up undo history. Every pixel-affecting setting is in the processing effect's dependency list, debounced 60 ms with a cancel flag; export-only settings (format, scale, quality, output size) and `gridOverlay` do not trigger reprocessing. Adding a new pixel-affecting setting means adding it to that dependency list, to `resetStage`, and to `lib/pipeline.ts` (`runPipeline` / `colorOptions`), which the studio and batch share. `loadFile` uses a request counter to drop stale decodes and calls `releaseSource` on replace.

**Stages.** The studio UI is four stages `image | grid | color | finish` (`lib/stages.ts`, `hooks/useTool.ts`), rendered as the `ToolRail` thumb tabs and the matching `components/inspector/*Panel.tsx`. `ExportTicket` is the full-width export bar under the bench, always visible; `lib/ticket.ts` computes why download is disabled.

**Pipeline** (all client-side, keep it that way):
1. `lib/validation.ts` + `lib/image.ts`: type/size check, decode to bitmap, cap source at `MAX_SOURCE_DIMENSION`.
2. `lib/dimensions.ts`: `computeGrid` resolves preset vs custom grid with aspect ratio; `computeAutoOutput` / `computeExportSize` derive output size × scale.
3. `lib/pixelate.ts` `rasterizeToGrid`: progressive halving downsample to the exact grid → `RgbaImage` (canvas-free buffer, so `lib/colors.ts` stays testable in node). `sampling: 'mode' | 'median'` instead reads about 8 source pixels per cell side and reduces each cell in `lib/sampling.ts`.
4. `lib/colors.ts` `processColors`: background composite → optional retro preset tone grade / contour ink → color mode (original, reduced via median-cut `extractPalette`, grayscale, monochrome, custom) with posterize and Floyd-Steinberg or Bayer dithering → optional NES tile discipline. Returns `ProcessedImage` (grid-sized RGBA + palette).
5. Preview: `renderProcessedPreview` nearest-neighbor upscales to display size, draws grid overlay. Export: `renderProcessedToCanvas` at final size, `canvasToBlob`, download (`lib/export.ts`). JPEG always gets a background fill.

**Touch-up edits** (`lib/edits.ts`) mutate copies of `processed` only; any reprocess discards them and clears undo.

All limits, presets, retro preset tuning, palettes, and `DEFAULT_SETTINGS` live in `src/constants.ts`; shared types in `src/types.ts`.
