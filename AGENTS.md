# AGENTS.md

## Repo state (verified 2026-11-14)
- Scaffolded and implemented: source, manifests, lockfile, docs, tests, and production build all present.
- Verified commands: `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`, `npm test`, `npm run check:contrast`.
- Deploy: `.github/workflows/pages.yml` builds with `--base=/beexie/` and publishes main to GitHub Pages. Public assets referenced from code must use `import.meta.env.BASE_URL`, never a root-absolute path.
- Real commands now exist: not greenfield. Source of truth is code; if docs and code disagree, trust code and fix the docs.
- Build size: 8.96 kB gzip CSS, 98.49 kB gzip JS (2026-11-14, Instruction Booklet + motion pass).
- Design tokens: The Instruction Booklet (docs/09-redesign-spec.md). Light booklet stock `#ffffff` / dark cartridge shell `#1d1e22`, ink `#16161a`, flat spot plates red `#d81e28`, yellow `#ffc81e`, blue `#2449e0`. Square corners, no shadows or gradients. 27/27 WCAG AA pairs via `npm run check:contrast`.
- Direction: Landing is the booklet (cover with the koi converted live on the red plate, How to play panels, live retro preset cards, safety page, Q and A, back cover). Studio is the booklet opened flat: thumb-index tabs 1 to 4 (open tab floods its stage plate), full-height single-stage inspector, full-width export bar. Signature: ghost-grid fill, stepped row reveal. Motion (docs/10-motion-spec.md): silk WebGL shader on the cover and back cover art plates only; all UI motion is stepped (src/styles/motion.css). Fonts: Dela Gothic One, Zen Kaku Gothic New, DotGothic16 (numerals only). Zero em-dashes. Zero Lanz0s in user copy.

## Hard gate: spec before code
- Development is Spec-Driven. Produce, in order: PRD → user stories + acceptance criteria → technical spec → UI/UX spec → implementation plan.
- Do not write implementation code before the user approves the specs ("Start by producing the complete product specification and implementation plan. Wait for specification approval before beginning implementation.").
- Keep specs in `docs/` (e.g. `docs/01-prd.md`, `docs/02-user-stories.md`, `docs/03-technical-spec.md`, `docs/04-ui-ux.md`, `docs/05-plan.md`, `docs/06-surface-brief.md`, `docs/07-v2-spec.md`, `docs/08-retro-presets-spec.md`).

## Product invariants
- It is an image-to-pixel-art converter, **not** a pixel-art editor/drawing app. The user supplies an image; the app transforms it. Exception (docs/07-v2-spec.md): touch-up only (pencil, eraser, picker, undo) on the processed grid; edits are discarded when settings re-process. Multi-file input exports a store-only zip of converted images plus sheet.png.
- All processing is client-side via Canvas APIs. Never upload user images to a server.
- Pipeline: decode → downsample to the target pixel resolution → nearest-neighbor upscale → render. Set `imageSmoothingEnabled = false` on canvas and use CSS `image-rendering: pixelated` in previews.
- Pixel resolution must genuinely drive the downsample grid, not act as a decorative CSS filter.
- Preserve aspect ratio by default; allow explicit override.
- Exports must be real encoded files containing the processed pixels at the chosen output dimensions/scale.
- No fake previews, hardcoded sample results, or placeholder features. Propose out-of-scope additions before building them.

## Required feature surface
- Upload: PNG/JPG/WEBP; drag-drop, click-to-browse, paste; type validation with visible errors; original preview; replace; reset.
- Sizing: resolution presets 8/16/32/64/128/256 + custom; pixel-size slider; custom width/height with maintain-aspect toggle.
- Color: original, reduced palette, monochrome, grayscale, custom palette; color quantization; dithering; deterministic hardware-era retro style presets (`16-Bit JRPG`, `Arcade Action`, `8-Bit Classic`, `Pocket Mono`, `Cyberpunk 1993`).
- Effects: pixel grid overlay, background color, optional transparent background.
- Preview: original vs converted, before/after, zoom, fit-to-screen, checkerboard behind transparency, live updates on setting change.
- Export: PNG/JPG/WEBP; output width/height; 1x/2x/4x/8x scale; background color for formats without alpha; quality for JPEG/WEBP; clear download button.
- Layout: header (logo/name, new project, reset, theme toggle), left controls sidebar, center preview, right export sidebar; responsive across desktop/tablet/mobile; light + dark themes; minimal styling, no gratuitous animation.

## Architecture expectations
- Separate concerns: UI components, upload/validation, pixelation engine, color processing, preview renderer, export pipeline, application state.
- Strongly typed interfaces, reusable components, no unnecessary dependencies.
- Performance: skip reprocessing when settings are unchanged, debounce expensive work, handle large images without freezing the UI, and revoke object URLs / release canvases when images are replaced.

## Testing / done
- Test with real images: every input format (PNG/JPG/WEBP), every resolution, extreme aspect ratios, large files, transparency, quantization, dithering, every export format, responsive breakpoints, and invalid uploads.
- Done means the full flow works end to end: open → upload → resolution → settings → preview → compare → choose format → configure dimensions → download real pixel art.
- `npm run typecheck` passes; `npm test` 70/70 pass; `npm run build` succeeds.
- `npm run check:contrast` - WCAG AA contrast verified across both themes (light, dark).
- `npx impeccable detect src/` → [] (zero anti-patterns).
- Impeccable live session completed: boot → poll → handle steer → exit → cleanup; no detected slops.

## Update this file
- Commands and entrypoints are recorded above; keep them in sync if scripts or structure change.