# 11 Issue batch spec: issues #1 to #8

Status: AWAITING APPROVAL. No implementation code until approved. Each section can be approved or cut on its own.

Covers the eight proposal issues on E1yWrites/beexie. Issues #9 (Pages), #10 (Playwright) and #11 (accessibility) carry no spec gate and ship separately.

Shared rules for every section:
- All processing stays client-side. No user image ever leaves the browser.
- Any new pixel-affecting setting joins the processing effect dependency list in `hooks/useConverter.ts`, `resetStage`, and the duplicated `processColors` options in `lib/batch.ts`.
- Pure logic lives in `src/lib/` with Vitest tests. Canvas paths are covered by extending `e2e/smoke.spec.ts` where noted.
- Copy follows the booklet voice: no em-dashes, brand is "beexie".
- Done gate per PR: typecheck, unit tests, `test:e2e`, build, `check:contrast`, `impeccable detect src/` clean.

## Order

1. #3 sharper downsample (touches the raster step that #8 moves)
2. #1 palette library
3. #5 SVG export
4. #2 maker chart export
5. #6 crop and rotate
6. #7 keyboard shortcuts
7. #8 Web Worker pipeline (after #3 and #6 so it moves the final shape of the pipeline once)
8. #4 settings persistence and preset JSON (last, so its validator covers every field added above)

## #3 Sharper downsample mode

- New setting `sampling: 'average' | 'mode' | 'median'`, default `'average'` (current behavior, bytes unchanged).
- `average`: current progressive halving path.
- `mode`: per output cell, the most frequent color among the source pixels it covers, colors bucketed to 5 bits per channel so near-identical noise counts as one color; ties go to the color closest to the cell average.
- `median`: per-channel median of the cell's pixels.
- `mode` and `median` read source pixels once via `getImageData` on the capped source, then reduce per cell in a pure function `sampleCells(rgba, srcW, srcH, gridW, gridH, method)` in `lib/sampling.ts`.
- UI: a three-way Segmented "Sampling" in the Grid panel under the presets, hint copy "Average blends, Mode keeps outlines, Median resists noise".
- AC: unit test on a synthetic 2-color checker edge shows `mode` output contains only the two source colors while `average` contains blends. Same input gives the same bytes. Default output is byte-identical to today.

## #1 Palette library with import and export

- Built-in palettes in `constants.ts` `PALETTE_PRESETS`: PICO-8 (fix: the current entry has 8 colors, the real palette has 16), DawnBringer 16, DawnBringer 32, Endesga 32, Game Boy (the existing Pocket Mono entry). Existing entries stay.
- Import: file input accepting `.gpl` (GIMP palette) and `.hex` (one `rrggbb` per line). Parsers in `lib/paletteFiles.ts`: `parseGpl`, `parseHex`, `toGpl`, `toHex`. Invalid lines are skipped; a file with zero valid colors shows an error and changes nothing. Palettes are capped at the existing custom palette maximum.
- Export: "Save palette" downloads the current custom palette as `.hex` or `.gpl`.
- Lospec slug: a text field "Lospec slug" fetches `https://lospec.com/palette-list/<slug>.json`. This is the only network call in the app and sends only the slug, never image data. Decision needed: keep or cut. If cut, users download the `.hex` from Lospec and import it, which already works offline.
- Picking or importing a palette switches color mode to `custom`, like today's presets.
- AC: parser unit tests for valid, commented, blank-line, malformed and oversized files; round trip `parseGpl(toGpl(p))` equals `p`; output pixels contain only palette colors.

## #5 SVG export

- `ExportFormat` gains `'svg'`. Format Segmented shows PNG, JPG, WEBP, SVG.
- `lib/svg.ts` `processedToSvg(processed): string`, pure. One `<rect>` per horizontal run of same-colored opaque pixels. `viewBox="0 0 gridW gridH"`, `width`/`height` set to the chosen output size, `shape-rendering="crispEdges"`. Transparent pixels emit nothing. With a background color and transparency off, one full-size background rect comes first.
- Quality control hides for SVG (no lossy encoding). Scale and output size still set the `width`/`height` attributes.
- Touch-up edits are included, because export reads the edited `processed`.
- AC: unit test on a known 4x2 grid gives the exact expected rect list; run merging reduces rect count on a flat row to 1. e2e downloads an SVG and checks its `viewBox`.

## #2 Maker chart export

- New export action "Maker chart" in the Finish stage, separate from the main download button. Output is a PNG.
- Layout, drawn on canvas in `lib/chart.ts`: the grid at a fixed cell size (24 px, reduced for grids over 128 so the chart stays under `MAX_EXPORT_DIMENSION`), each cell filled with its color and marked with a symbol from a fixed set of 48 high-contrast glyphs (number fallback past 48 colors), symbol ink black or white by luminance. Bold rule every 10 cells. Coordinate rulers on top and left. Legend below: swatch, symbol, hex, and count per color, sorted by count.
- Counts come from `ProcessedImage` via a pure `countColors(processed)` that skips transparent pixels.
- AC: `countColors` unit test (counts sum to opaque pixel count); chart dimensions unit test from a pure `chartLayout(gridW, gridH, colors)`; e2e downloads a chart for a 32 grid and checks PNG dimensions match `chartLayout`.

## #6 Crop and rotate the source

- Boundary, stated for AGENTS.md: crop and rotate are input transforms applied to the whole source before pixelation. They never paint, add, or move individual pixels. beexie stays a converter. The AGENTS.md invariant gets one line naming this exception, like the touch-up exception.
- New source transform in state: `rotation: 0 | 90 | 180 | 270` and `crop: { x, y, width, height } | null` in source pixel coordinates, held in `useConverter` next to `source`, reset when the image is replaced.
- Rotation swaps width and height for grid and aspect math. Applied once when building the raster input (draw the bitmap rotated and cropped onto the source canvas), so every later step is unchanged.
- UI in the Image stage: Rotate left, Rotate right, Crop. Crop shows a rectangle with corner handles over the Original preview, an aspect lock (free, 1:1, current grid ratio), Apply and Cancel. Keyboard: arrow keys move the crop, Shift plus arrow resizes.
- Both are pixel-affecting and follow the shared rules. Batch mode ignores them (per-image transforms are out of scope).
- AC: pure `transformedSize(w, h, rotation, crop)` unit tests; crop clamped to bounds; e2e rotates a 120x60 source and checks the grid aspect flips to 1:2.

## #7 Keyboard shortcuts

- Global keydown listener in `App.tsx`, studio view only, ignored when focus is in an `input`, `textarea`, `select` or `contenteditable`, and when Ctrl, Meta or Alt is held (except the undo binding that exists today).
- Bindings: `1` to `4` stages, `O` Original, `P` Pixel art, `C` Compare, `+` / `=` zoom in, `-` zoom out, `0` fit, `D` download, `?` opens the reference.
- Reference: a small dialog opened from a "Keys" button in the header and by `?`, listing every binding. Native `<dialog>` with focus trap and Escape to close.
- Bindings live in one table `lib/shortcuts.ts` so the handler and the dialog read the same source. Pure `matchShortcut(event, focusTag)` is unit tested.
- AC: unit tests for each binding and for ignoring text fields; e2e presses `2` and sees the Grid stage open.

## #8 Pixel pipeline in a Web Worker

- `rasterizeToGrid` and `processColors` move into `src/workers/pipeline.worker.ts` (Vite `?worker` import, no dependency). The worker receives a transferred `ImageBitmap` copy plus settings and returns the `ProcessedImage` buffers as transferables.
- Raster step uses `OffscreenCanvas` inside the worker. Fallback: if `OffscreenCanvas` 2D is missing, the current main-thread path runs.
- `useConverter` keeps the 60 ms debounce. Cancel: every request carries an id; stale responses are dropped, matching the current cancel flag.
- Batch mode uses the same worker sequentially.
- Measure before and after on a 4096 px source with Floyd-Steinberg at 256 grid: main-thread blocking time (Long Tasks) and wall time, recorded in this doc. AC: no main-thread long task over 50 ms during reprocessing; output bytes identical to the main-thread path for the e2e fixtures.

## #4 Remember settings and share presets as JSON

- Persist `ConverterSettings` to `localStorage` key `beexie-settings` on change (debounced 300 ms), read on startup. Reads and writes wrapped in try/catch; storage failure is silent and falls back to `DEFAULT_SETTINGS`.
- Export preset: "Save look" downloads `beexie-look.json` `{ "beexie": 1, "settings": { ... } }`. Import preset: file input in the Finish stage.
- Validation `lib/settingsSchema.ts` `parseSettings(unknown): ConverterSettings`, hand-written, no dependency: each field is checked against its type and allowed values; a bad field falls back to its `DEFAULT_SETTINGS` value; a non-object or wrong `beexie` version falls back to `DEFAULT_SETTINGS` entirely and shows an error toast. Unknown fields are dropped.
- Not persisted: the image, touch-up edits, crop and rotation (they belong to one image).
- AC: unit tests for valid JSON, every field invalid, extra fields, wrong version, and round trip.

## Out of scope

GIF or animated export, per-image settings in batch, cloud presets or share URLs, PDF charts, free-angle rotation.
