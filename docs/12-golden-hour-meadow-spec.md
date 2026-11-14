# 12 Golden Hour Meadow: palette and voxel sunset spec

Status: **approved by the user on 2026-11-15 ("Approve, build it").**

User decisions (2026-11-15), picked from the comp board at `.impeccable/mocks/palette/index.html`:
- Palette: **B. Golden Hour Meadow**.
- Scene reach: the voxel scene replaces the silk on **both** the cover (sunset) and the back cover (the same world after dusk).
- Motion: **stepped drift**. Clouds and the water glint move a pixel at a time; one still frame under reduced motion.

Builds on `docs/09-redesign-spec.md` (The Instruction Booklet) and replaces the silk sections of `docs/10-motion-spec.md`.

## 1. What changes and what stays

Stays: the booklet structure (label band, cover, How to play, presets, safety page, Q and A, back cover; Studio tabs, bench, inspector, export bar), square corners, 2 px keylines, the three fonts, stepped UI motion, sprites at true integer scale, every feature and copy line.

Changes:
- The red, yellow and blue spot plates become a meadow set: sun orange, gold, grass green, tide teal. The ink becomes a deep moss black instead of neutral black. Paper gets a faint green tint in light; the dark theme becomes a moss-dark shell instead of a neutral charcoal.
- The WebGL silk (`SilkPlate.tsx`, the shader, `COVER_SILK`, `--maroon`) is deleted. A canvas voxel scene takes its place.
- Grass green becomes the action color (primary buttons, focus, Download). Today blue owns that role.

Rule translation: spec 10 allowed one glide register for art plates. That register goes away. Everything now moves in steps, the art plates included, which brings the whole page back to one motion grammar.

Content rule: the scene is an original blocky landscape drawn in code. No textures, names, logos or block designs from any existing game.

## 2. Tokens

Role names move from hues to roles so a later palette change does not leave `--red` holding green. Old to new:

| Old token | New token | Role |
|---|---|---|
| `--red`, `--on-red`, `--red-text` | `--sun`, `--on-sun`, `--sun-text` | Image stage plate, emphasis in headlines |
| `--yellow`, `--on-yellow` | `--gold`, `--on-gold` | Grid stage plate, selected callouts, toggles |
| `--blue`, `--on-blue`, `--blue-text` | `--grass`, `--on-grass`, `--grass-text` | Action: primary buttons, Download, focus, Color stage plate |
| (new) | `--tide`, `--on-tide` | Finish stage plate, info |
| `--maroon` | removed | |

Values (from the approved comp, with light `--sun` lifted from `#e8641c` to `#ec6a20` so its label text clears 4.5:1). Every pair was checked before writing this spec (lowest: `--on-tide` on `--tide` light 4.61, `--on-sun` on `--sun` light 4.74) and goes into `scripts/check-contrast.cjs`:

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#f8fbf4` | `#141c16` |
| `--sheet` | `#eef3e6` | `#1d2a1f` |
| `--sheet-2` | `#e2eadb` | `#26342a` |
| `--ink` | `#1d2a1f` | `#f1f7ea` |
| `--ink-muted` | `#4c5c4c` | `#adbda9` |
| `--rule` | `#1d2a1f` | `#8a9c88` |
| `--rule-soft` | `#cfdac6` | `#2f3f31` |
| `--keyline` | `#1d2a1f` | `#080d09` |
| `--sun` / `--on-sun` | `#ec6a20` / `#1d2a1f` | `#ff8a3d` / `#141c16` |
| `--sun-text` | `#b4470c` | `#ff9d5c` |
| `--gold` / `--on-gold` | `#ffd23f` / `#1d2a1f` | `#ffd23f` / `#141c16` |
| `--grass` / `--on-grass` | `#2f7a2a` / `#ffffff` | `#7ccf4f` / `#141c16` |
| `--grass-text` | `#2f7a2a` | `#7ccf4f` |
| `--tide` / `--on-tide` | `#2f7f8f` / `#ffffff` | `#4fb3c4` / `#141c16` |
| `--focus` | `#2f7a2a` | `#7ccf4f` |
| `--success` | `#2f7a2a` | `#7ccf4f` |
| `--danger` / `--on-danger` | `#b42318` / `#ffffff` | `#ff8a75` / `#141c16` |
| `--checker-a` / `-b` | `#e6ecdd` / `#f2f6ec` | `#1f2a21` / `#18211a` |
| `--ghost` | `#dfe7d6` | `#26342a` |

Success and action share green. Saved and error messages already carry text, so color is never the only signal; the danger red stays clearly apart from the green.

Errors (the alert box and the error toast badge) move from the old red plate to `--danger` with `--on-danger` text, so an error never reads as the orange Image plate. Added during the build.

Stage tabs: 1 Image `--sun`, 2 Grid `--gold`, 3 Color `--grass`, 4 Finish `--tide`. Label text on each plate uses its `--on-*` token.

The safety page plate (yellow today) becomes `--gold`. The bee mark keeps its geometry; its tail stripe moves from red to `--sun`.

## 3. The voxel scene

New `src/components/ui/VoxelPlate.tsx` replaces `SilkPlate.tsx`. One component, two scenes: `variant="sunset" | "dusk"`.

- Drawn once into a 192 x 120 canvas at true pixel scale, then shown with `image-rendering: pixelated` at an integer multiple where the plate allows it (`object-fit: cover` cropping from the center otherwise, never smoothing).
- Layers, back to front: stepped sky bands with a one-row checker dither at each seam; a block sun with a glow ring sitting on the horizon (dusk: a block moon and a few star pixels); flat cloud slabs with a lit underside; a far range in 4 px columns; a near range in 6 px columns; water with the sun's reflection as stepped rows; a foreground island of 8 px grass and dirt blocks with block trees.
- Colors come from one scene table per variant in `constants.ts`, next to the tokens they echo:
  - Sunset: sky `#2b5f8a #4a86a8 #7fb3bf #f6c76b #ff9f43 #ff7a2f`, sun `#ffd23f` core `#fff2b0`, cloud `#fbe3c0` lit `#ffffff`, far `#5b7f8f`, near `#3d6b5a`, water `#2f7f8f` glint `#ffd23f`, grass `#4a9c3a` lit `#7ccf4f`, dirt `#8a5a33` dark `#6b4226`, leaf `#2f7a35` lit `#58a845`.
  - Dusk: sky `#0d1626 #13233a #1d3550 #2b5f8a #3d6b7a`, moon `#fbe3c0`, stars `#fff2b0`, cloud `#2b4a63` lit `#4a86a8`, far `#1d3550`, near `#16283a`, water `#163a4a` glint `#fbe3c0`, grass `#2f6b2f` lit `#4a9c3a`, dirt `#5a3b22` dark `#43301c`, leaf `#1f4f2a` lit `#2f7a35`.
- Layout and type over the plates keep today's positions: the cover koi sprite card, grid callouts and palette strip sit on the sunset plate; "Your turn." and the colophon sit on the dusk plate. Text on the plates sits on paper or ink chips, so it never depends on the sky behind it.
- The cover koi sprite stays real pipeline output, unchanged.

## 4. Motion: stepped drift

- Clouds move 1 scene pixel every 600 ms and wrap around. The water glint rows swap between two frames every 900 ms. Dusk stars blink one at a time every 1.2 s.
- Each tick redraws the 192 x 120 canvas (cheap; no WebGL). One `setInterval` per plate.
- Paused when the plate is off screen (IntersectionObserver) or the tab is hidden, as the silk did.
- `prefers-reduced-motion: reduce`: one still frame, no timer.
- No eased motion anywhere on the page after this change.

## 5. Files

- `src/styles/tokens.css`: new values and role names; every CSS file renamed to the new tokens.
- `scripts/check-contrast.cjs`: new values and pairs, both themes, plus plate-label pairs (`--on-*` on each plate) and card edge on the darkest sky color.
- `src/components/ui/VoxelPlate.tsx`: new. `src/components/ui/SilkPlate.tsx`: deleted.
- `src/components/landing/LandingHero.tsx`, `LandingFooter.tsx`: use `VoxelPlate`.
- `src/constants.ts`: scene tables.
- `docs/10-motion-spec.md`: note that the silk register is retired by this spec.
- `DESIGN.md`, `.impeccable/design.json`, `PRODUCT.md` Brand Commitments: updated at the end from the built result (impeccable documenter).
- AGENTS.md "Design tokens" and "Direction" lines updated.

## 6. Done when

- `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build` pass.
- `npm run check:contrast` passes every pair in both themes.
- `npx impeccable detect src/` returns no findings.
- No `--red`, `--yellow`, `--blue`, `--maroon` or `SilkPlate` left in `src/`.
- Browser check at 1440, 768 and 375 px in both themes: landing cover, safety page, back cover, Studio with each stage open, dialogs.
- Reduced motion shows still scenes; an off-screen plate stops its timer.

## Out of scope

Retro preset palettes (they describe hardware looks, not the brand), the koi specimen, layout changes, new copy.
