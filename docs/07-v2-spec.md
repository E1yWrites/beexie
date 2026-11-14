# 07 v2 spec: palettes, Bayer, touch-up, batch, sprite sheet

Status: AWAITING APPROVAL. No code until approved. GIF export is out of scope.

## Scope and acceptance criteria

### A. Preset palettes
- Palette picker in ColorPanel offers Game Boy, PICO-8, NES, Sweetie 16.
- Picking one switches mode to `custom` and fills `customPalette`.
- Edge: the preset list is a constant in `constants.ts`; no new engine path.
- AC: output pixels contain only preset colors (unit test).

### B. Ordered Bayer dithering
- `dithering: boolean` becomes `dither: 'none' | 'floyd' | 'bayer'`.
- Bayer 4x4 threshold matrix is applied to the error-free value before nearest-palette or posterize.
- AC: deterministic output; the same input gives the same bytes (unit test).
- Migration: the old `dithering: true` maps to `'floyd'`.

### C. Touch-up (decision: edits are discarded on settings change)
- Tools: pencil, eraser, eyedropper, undo. No layers, fill or selection.
- Edits apply to the processed grid and live in an overlay map `Map<index, rgba>`.
- Changing a setting or replacing the image clears the overlay, after a one-line confirm if the overlay is non-empty. This keeps the pipeline pure and avoids reconciling edits with re-quantization.
- Export merges the overlay into the grid before rendering.
- AC: pencil pixel appears in the exported PNG at the correct scaled position; undo restores it.
- Rationale: ponytail ultra. Persisting edits across re-processing needs coordinate remapping on grid resize, which is not worth it.

### D. Batch convert
- Multi-file input uses the current settings, with no per-image tweaks.
- Output is a zip. Writer is a store-only (no compression) zip in about 40 lines. No dependency, because PNG is already compressed.
- AC: N files in, a zip with N valid PNG/JPG/WEBP files out, names deduped.
- Validation reuses `validation.ts` per file; invalid files are listed and skipped.

### E. Sprite sheet export
- Takes the batch outputs and tiles them in a grid canvas (columns input, default ceil(sqrt N)), cell size = max frame size.
- Exports as one PNG. Reuses `renderProcessedToCanvas` and `canvasToBlob`.
- AC: a sheet of N frames has the expected dimensions; each cell holds the right pixels.

## Out of scope
GIF, OKLab matching, mode downsample, outlines, adjust sliders, persistence, share URLs.

## Plan
1. B and A (colors.ts, constants.ts, ColorPanel, tests)
2. C (new `lib/edits.ts`, a canvas pointer layer in ProofFrame, tests)
3. D then E (new `lib/zip.ts`, `lib/sheet.ts`, tests)
4. Update AGENTS.md invariant: the converter now allows touch-up edits.
