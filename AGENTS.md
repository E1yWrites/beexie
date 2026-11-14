# AGENTS.md

## Repo state (verified 2026-11-10)
- Scaffolded and implemented: source, manifests, lockfile, docs, tests, and production build all present.
- Verified commands: `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`, `npm test`, `npm run check:contrast`.
- Real commands now exist: not greenfield. Source of truth is code; if docs and code disagree, trust code and fix the docs.
- Build size: 10.10 kB gzip CSS, 93.13 kB gzip JS.
- Design tokens: Spot-Ink Proof Studio Dual-Theme system (Cotton-Press Ivory `#f8f6f1` / Pressroom Charcoal `#12141a`, Electric Cobalt `#1e46e8` / `#2d55eb`, Vermilion `#eb4a2d` / `#ff5a3c`, 18/18 WCAG AA verified across Light and Dark themes).
- Direction: beexie Spot-Ink Proof Studio. Mirrored flowing cubic-Bezier `BackgroundPaths` (`Path2D` Canvas 2D, live on Landing and static calm lines in Studio) paired with pure-Cobalt pointer-tracking Spotlight Card border/surface glow (`useSpotlightCards`, `[data-spotlight]`), self-hosted `Bricolage Grotesque` / `Archivo` / `Martian Mono` typography (mono reserved strictly for tabular numeric data and hex swatches), unified `strokeWidth=1.75` custom SVG icon set including geometric `<BeeMark />`, asymmetric Landing hero (`0.84fr / 1.36fr`) with live `Compare | Pixel art | Original` specimen workbench (`public/specimen.jpg`), framed 4-column hairline Pipeline Proof Sheet (`LandingFeatures.tsx`) and `0.84fr / 1.36fr` Split FAQ Accordion Sheet (`LandingFaq.tsx`) with bottom CTA sheet & focus-trapped `LegalModal`, and full Studio workbench with `64px` `01-04` edge stage rail, spacing-grouped `.panel-group` inspector, mathematical `inner = outer - padding` sheet/segmented geometry, explicit loading feedback states, and dashed-rule Export ticket. Full tablet/mobile responsiveness (`< 1180px`, `< 760px`, `< 480px`). Zero em-dashes across codebase. Zero Lanz0s in user copy.

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
- Color: original, reduced palette, monochrome, grayscale, custom palette; color quantization; dithering; deterministic hardware-era retro style presets (`16-Bit JRPG`, `Arcade Action`, `8-Bit Classic`, `Game Boy DMG`, `Cyberpunk 1993`).
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