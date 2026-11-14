# beexie Pixel Studio

Client-side image-to-pixel-art converter designed as **The Instruction Booklet**: the booklet from the game box, with flat red, yellow, and blue plates, numbered spreads, and sprites printed at integer scale. Upload any PNG/JPG/WEBP, tune integer grid resolution, palette quantization, dithering, and preview mode, then export a real bitmap at exact output dimensions: everything runs locally in your browser with zero uploads.

## Live flow

1. **Intake:** Drop, browse, or paste any PNG, JPG, or WEBP up to 30 MB.
2. **Grid:** Pick resolution presets (8/16/32/64/128/256), set exact custom dimensions, or drag the pixel-size slider.
3. **Color:** Keep original colors, extract a Median-Cut palette (2-64 swatches), switch to grayscale or 1-bit monochrome, or build a custom hex swatch palette, paired with optional Floyd-Steinberg dithering, grid overlay, and channel posterization.
4. **Preview:** Switch between Original, Pixel art, and interactive split Compare with a red drag rule, zoom/fit controls, and transparency checkerboard.
5. **Export:** Configure PNG/JPG/WEBP format, 1x/2x/4x/8x scale, background alpha fill, or lossy quality, and download real pixel art.

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Strict TypeScript check + production build |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run TypeScript in strict mode |
| `npm test` | Run all 70 Vitest unit tests |
| `npm run check:contrast` | Verify all 24 WCAG AA color contrast pairs across light and dark themes |

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- HTML Canvas 2D for area-averaged downsampling, Median-Cut palette quantization, Floyd-Steinberg dithering, and nearest-neighbor upscale
- Self-hosted Dela Gothic One (display), Zen Kaku Gothic New (UI), and DotGothic16 (numerals and readouts), all OFL
- Signature ghost-grid fill: converted art reveals row by row in stepped time (instant with reduced motion)
- Two motion registers (docs/10-motion-spec.md): a dependency-free WebGL silk shader glides on the cover and back cover art plates; every UI change snaps in steps (tab flood, swatch cascade, readout ticks, export stamp, theme wipe). Silk pauses off screen and freezes under reduced motion
- Vitest for unit tests
- Hand-written CSS design tokens and stylesheets (zero UI framework dependencies)

## Project structure

```
src/
  App.tsx                     Studio orchestration, global drop/paste, download, toasts
  main.tsx                    React entry (no StrictMode; preserves ImageBitmap/object URLs)
  components/
    icons.tsx                 BeeMark + square-cap 2px UI SVG icon set
    Toast.tsx                 Printed-slip feedback toast
    landing/
      LandingPage.tsx         Landing composition + legal modal state
      LandingNav.tsx          Sticky navigation header + theme toggle
      LandingHero.tsx         Cover: koi converted live on the red plate; drop an image to reprint it
      LandingFeatures.tsx     How to play: four stage panels with lettered control diagrams
      LandingPresets.tsx      The five retro presets rendered live as cartridge labels
      LandingPrivacy.tsx      The "stays in your browser" safety page
      LandingFaq.tsx          Questions and answers
      LandingFooter.tsx       Back cover CTA + colophon links
      sprite.tsx              Shared specimen loader, live pipeline hook, integer-scaled Sprite canvas
      LegalModal.tsx          Accessible tabbed Privacy, Terms & Licenses dialog
    shell/
      AppHeader.tsx           Studio header (beexie mark, Overview link, active file, New project, Theme toggle)
      ToolRail.tsx            Thumb-index stage tabs 1 to 4; the open tab floods its stage plate
    workspace/
      Workspace.tsx           Stage bar, proof sheet container, empty bench, status bar
      StageBar.tsx            Mode segmented control + Fit/Zoom controls
      ProofFrame.tsx          Original vs pixel-art Canvas split comparator & loading state
      EmptyBench.tsx          Dropzone bench + Koi Pond specimen loader
      StatusBoard.tsx         Ready indicator + live grid/output/palette telemetry
    inspector/
      Inspector.tsx           Single-stage panel at full height
      ImagePanel.tsx          01 Intake panel
      GridPanel.tsx           02 Grid panel
      ColorPanel.tsx          03 Color, palette swatch comb & dithering panel
      FinishPanel.tsx         04 Finish dimensions & quality panel
      PaletteComb.tsx         Adaptive swatch matrix
      ExportTicket.tsx        Full-width export bar under the bench (format, scale, background, output, Download)
    ui/
      Segmented.tsx, Slider.tsx, Toggle.tsx, NumberField.tsx, ColorField.tsx
  lib/                        Pixelation math, colors, median-cut, dithering, validation, export
  hooks/                      Converter state, debounced values, element size, theme persistence
  styles/                     tokens.css, base.css, shell.css, stage.css, inspector.css, ticket.css, landing.css, responsive.css
docs/                         Product specs (01-prd through 06-surface-brief) & DESIGN.md
```

## Key behaviours

- **No server upload:** Every image decodes and processes strictly in client browser memory via Canvas 2D; object URLs are revoked via `URL.revokeObjectURL()` and bitmaps closed when replaced or cleared.
- **Genuine pixelation:** Downsampling uses progressive box area averaging to target integer grids before strict nearest-neighbor scaling (`imageSmoothingEnabled = false`, `image-rendering: pixelated`).
- **Source & export caps:** Source images longer than 4096 px per side are capped on import; exports allow up to 16,384 px per side and block invalid combinations visibly.
- **Dual-theme contrast parity:** Light booklet stock (`#ffffff`) and dark cartridge shell (`#1d1e22`) persisted in `localStorage` (`beexie-theme`), passing all 24 WCAG AA checks.
- **Accessibility:** Keyboard-navigable tabs/focus trapping in modals, labeled sliders/controls, `prefers-reduced-motion` collapse, and `>= 44px` coarse-pointer touch targets.

## Browser support

Modern browsers supporting `createImageBitmap`, Canvas 2D, and `Path2D` (Chrome, Edge, Firefox, Safari). WebP export relies on browser `canvas.toBlob('image/webp')` support.

## Contributing

1. Branch per change (`feature/...`, `fix/...`, `redesign/...`) and open a pull request into `main`.
2. New features start as a spec in `docs/` and get approved before any code (see `AGENTS.md`).
3. Before opening a PR, run `npm run typecheck && npm test && npm run build && npm run check:contrast`. CI runs the same checks.
4. Copy rules: no em-dashes, and the user-facing brand is always "beexie".

## License

MIT, see `LICENSE`.
