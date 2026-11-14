# beexie Pixel Studio

Client-side image-to-pixel-art converter built on the **Spot-Ink Proof Studio** system. Upload any PNG/JPG/WEBP, tune integer grid resolution, palette quantization, dithering, and preview mode, then export a real bitmap at exact output dimensions: everything runs locally in your browser with zero uploads.

## Live flow

1. **Intake:** Drop, browse, or paste any PNG, JPG, or WEBP up to 30 MB.
2. **Grid:** Pick resolution presets (8/16/32/64/128/256), set exact custom dimensions, or drag the pixel-size slider.
3. **Color:** Keep original colors, extract a Median-Cut palette (2-64 swatches), switch to grayscale or 1-bit monochrome, or build a custom hex swatch palette, paired with optional Floyd-Steinberg dithering, grid overlay, and channel posterization.
4. **Preview:** Switch between Original, Pixel art, and interactive split Compare with Vermilion drag handle, zoom/fit controls, and transparency checkerboard.
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
| `npm run check:contrast` | Verify all 18 WCAG AA color contrast pairs across Light & Dark themes |

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- HTML Canvas 2D for area-averaged downsampling, Median-Cut palette quantization, Floyd-Steinberg dithering, and nearest-neighbor upscale
- Mirrored flowing cubic-Bezier `BackgroundPaths` canvas backdrop (`Path2D`, animated on Landing, calm in Studio) + pure Cobalt pointer-tracking `[data-spotlight]` card highlights
- Vitest for unit tests
- Hand-written CSS design tokens and stylesheets (zero UI framework dependencies)

## Project structure

```
src/
  App.tsx                     Studio orchestration, global drop/paste, download, toasts
  main.tsx                    React entry (no StrictMode; preserves ImageBitmap/object URLs)
  components/
    icons.tsx                 Geometric BeeMark + unified strokeWidth=1.75 UI SVG icon set
    Toast.tsx                 Animated feedback toast pill
    landing/
      LandingPage.tsx         Landing composition + legal modal state
      LandingNav.tsx          Sticky navigation header + theme toggle
      LandingHero.tsx         Asymmetric hero + live 4:3 specimen workbench (/specimen.jpg)
      LandingFeatures.tsx     Four sequential press-stage descriptions
      LandingFaq.tsx          Local privacy and pipeline FAQ
      LandingFooter.tsx       Bottom CTA sheet + colophon links
      LegalModal.tsx          Accessible tabbed Privacy, Terms & Licenses dialog
    shell/
      AppHeader.tsx           Studio header (beexie mark, Overview link, active file, New project, Theme toggle)
      ToolRail.tsx            Slim 64px 01-04 stage index rail
    workspace/
      Workspace.tsx           Stage bar, proof sheet container, empty bench, status bar
      StageBar.tsx            Mode segmented control + Fit/Zoom controls
      ProofFrame.tsx          Original vs pixel-art Canvas split comparator & loading state
      EmptyBench.tsx          Dropzone bench + Koi Pond specimen loader
      StatusBoard.tsx         Ready indicator + live grid/output/palette telemetry
    inspector/
      Inspector.tsx           Stage panel switcher + persistent Export ticket
      ImagePanel.tsx          01 Intake panel
      GridPanel.tsx           02 Grid panel
      ColorPanel.tsx          03 Color, palette swatch comb & dithering panel
      FinishPanel.tsx         04 Finish dimensions & quality panel
      PaletteComb.tsx         Adaptive swatch matrix
      ExportTicket.tsx        Dashed-rule export configuration & download button
    ui/
      background-paths.tsx    Mirrored flowing Bezier BackgroundPaths canvas (animated on Landing, calm in Studio)
      Segmented.tsx, Slider.tsx, Toggle.tsx, NumberField.tsx, ColorField.tsx
  lib/                        Pixelation math, colors, median-cut, dithering, validation, export
  hooks/                      Converter state, debounced values, element size, spotlight pointer tracking, theme persistence
  styles/                     tokens.css, base.css, shell.css, stage.css, inspector.css, ticket.css, landing.css, responsive.css
docs/                         Product specs (01-prd through 06-surface-brief) & DESIGN.md
```

## Key behaviours

- **No server upload:** Every image decodes and processes strictly in client browser memory via Canvas 2D; object URLs are revoked via `URL.revokeObjectURL()` and bitmaps closed when replaced or cleared.
- **Genuine pixelation:** Downsampling uses progressive box area averaging to target integer grids before strict nearest-neighbor scaling (`imageSmoothingEnabled = false`, `image-rendering: pixelated`).
- **Source & export caps:** Source images longer than 4096 px per side are capped on import; exports allow up to 16,384 px per side and block invalid combinations visibly.
- **Dual-theme contrast parity:** Light Cotton Ivory (`#f8f6f1`) and Dark Pressroom Charcoal (`#12141a`) persisted in `localStorage` (`beexie-theme`), passing all 18 WCAG AA checks.
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
