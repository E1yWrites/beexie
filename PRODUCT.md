# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Pixel artists, game developers, and modders creating sprite, tile, or texture references.
- Designers creating retro avatars, editorial graphics, social assets, and posters.
- Makers crafting cross-stitch, bead, perler, and physical grid patterns.
- Visual artists wanting authentic, mathematically sound low-resolution pixel art.

## Product Purpose

Turn any image into genuine pixel art in seconds with fine-grained control over integer grid resolution, Median-Cut palette reduction, Floyd-Steinberg dithering, and multi-scale nearest-neighbor export. 100% client-side Canvas processing: zero server uploads, 100% private.

## Product Surfaces

1. **Landing Page (the booklet):** A label band (bee mark, wordmark, How to play / Presets / FAQ, theme toggle, Open Studio) over a booklet cover: a maroon silk art plate holding the koi specimen as a live sprite run through the real pipeline at a true integer scale, with lettered callouts for grid size (16 / 32 / 48 / 96), dither, and photo, and the extracted palette beneath it; the white column carries the headline, pitch, Open Studio button, and a drop target that converts a dropped image on the cover in place before carrying it into the Studio. Below: four How to play panels (one per stage, each a diagram of the real control with lettered leader-line callouts), five live retro preset cards (16-Bit JRPG, Arcade Action, 8-Bit Classic, Pocket Mono, Cyberpunk 1993) each rendering the koi through that preset, a yellow "It stays in your browser" safety page of numbered privacy facts, a Q and A, and a blue silk back cover ("Your turn.") with the colophon and Privacy / Terms / Licenses dialog.
2. **Pixel Art Studio (the booklet opened flat):** A label band (bee mark, file name, New project, theme), four thumb-index stage tabs (1 Image, 2 Grid, 3 Color, 4 Finish) whose open tab floods its stage plate, a central canvas with view mode, touch-up, and zoom on its top rim, a ghost grid when empty, and readouts in fixed slots on its bottom rim, a full-height inspector showing only the active stage, and a full-width export bar (format, scale, background, Output, Download) that is always visible.

## Brand Commitments

- **Name:** **beexie** (lowercase wordmark in the display face, paired with the bee mark, which keeps its geometry with a red tail stripe).
- **Specimen:** Existing CC0 photographic specimen (`public/specimen.jpg`, 1024x1024 koi pond), always shown as real pipeline output, never a baked sample.
- **Visual Direction:** The Instruction Booklet: white booklet stock in light theme and a charcoal cartridge shell in dark theme, black ink, flat red, yellow, and blue spot plates, square corners, and sprites at true integer scale. Silk motion lives only on the cover and back cover art plates; all UI motion is stepped.
- **Preview Equals Export:** The exact processed pixels render the preview and the encoded file.
- **Resolution is Real:** True area-averaged integer downsampling math, never a decorative CSS filter.
- **Accessibility & Contrast:** WCAG AA contrast verified across both themes and the silk art plates (`npm run check:contrast`), with every animation honoring `prefers-reduced-motion`.
