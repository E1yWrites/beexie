---
name: "beexie: The Instruction Booklet, Golden Hour Meadow"
description: "Client-side image-to-pixel-art studio printed like the booklet from a game box, inked in the colors of a blocky sunset: meadow paper or moss shell, moss ink, flat sun, gold, grass, and tide plates, square corners, voxel art plates, and sprites at true integer scale."
colors:
  meadow-paper: "#f8fbf4"
  meadow-sheet: "#eef3e6"
  meadow-trough: "#e2eadb"
  moss-ink: "#1d2a1f"
  moss-muted: "#4c5c4c"
  soft-rule: "#cfdac6"
  keyline: "#1d2a1f"
  sun-plate: "#ec6a20"
  sun-text: "#b4470c"
  gold-plate: "#ffd23f"
  grass-plate: "#2f7a2a"
  tide-plate: "#2f7f8f"
  danger: "#b42318"
  checker-light-a: "#e6ecdd"
  checker-light-b: "#f2f6ec"
  ghost-cell: "#dfe7d6"
  scrim: "rgba(29, 42, 31, 0.56)"
  moss-shell: "#141c16"
  moss-shell-sheet: "#1d2a1f"
  moss-shell-trough: "#26342a"
  shell-ink: "#f1f7ea"
  shell-muted-ink: "#adbda9"
  shell-rule: "#8a9c88"
  shell-soft-rule: "#2f3f31"
  sun-on-shell: "#ff8a3d"
  sun-text-on-shell: "#ff9d5c"
  grass-on-shell: "#7ccf4f"
  tide-on-shell: "#4fb3c4"
  danger-on-shell: "#ff8a75"
  checker-dark-a: "#1f2a21"
  checker-dark-b: "#18211a"
  ghost-cell-on-shell: "#26342a"
  scrim-on-shell: "rgba(6, 10, 7, 0.72)"
  sunset-sky-top: "#2b5f8a"
  sunset-glow: "#ff9f43"
  dusk-sky-top: "#0d1626"
typography:
  display:
    fontFamily: "'Dela Gothic One', 'Zen Kaku Gothic New', sans-serif"
    fontSize: "clamp(44px, 5vw, 84px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Dela Gothic One', 'Zen Kaku Gothic New', sans-serif"
    fontSize: "clamp(32px, 4vw, 56px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Dela Gothic One', 'Zen Kaku Gothic New', sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "normal"
  body:
    fontFamily: "'Zen Kaku Gothic New', ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "'Zen Kaku Gothic New', ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  pixel:
    fontFamily: "'DotGothic16', ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.02em"
  numeral:
    fontFamily: "'DotGothic16', ui-monospace, monospace"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
rounded:
  none: "0px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "20px"
  s-6: "24px"
  s-7: "32px"
  s-8: "48px"
  s-9: "72px"
components:
  button-primary:
    backgroundColor: "{colors.grass-plate}"
    textColor: "{colors.meadow-paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.moss-ink}"
    textColor: "{colors.meadow-paper}"
  button-cover:
    backgroundColor: "{colors.moss-ink}"
    textColor: "{colors.meadow-paper}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "60px"
  button-cover-hover:
    backgroundColor: "{colors.grass-plate}"
    textColor: "{colors.meadow-paper}"
  button-secondary:
    backgroundColor: "{colors.meadow-paper}"
    textColor: "{colors.moss-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.moss-ink}"
    textColor: "{colors.meadow-paper}"
  segmented-option:
    backgroundColor: "{colors.meadow-paper}"
    textColor: "{colors.moss-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "34px"
  segmented-option-pressed:
    backgroundColor: "{colors.moss-ink}"
    textColor: "{colors.meadow-paper}"
  thumb-tab:
    backgroundColor: "{colors.meadow-sheet}"
    textColor: "{colors.moss-ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.none}"
    padding: "8px 4px"
    width: "72px"
    height: "84px"
  thumb-tab-image:
    backgroundColor: "{colors.sun-plate}"
    textColor: "{colors.meadow-paper}"
  thumb-tab-grid:
    backgroundColor: "{colors.gold-plate}"
    textColor: "{colors.moss-ink}"
  thumb-tab-color:
    backgroundColor: "{colors.grass-plate}"
    textColor: "{colors.meadow-paper}"
  thumb-tab-finish:
    backgroundColor: "{colors.moss-ink}"
    textColor: "{colors.meadow-paper}"
  input-number:
    backgroundColor: "{colors.meadow-paper}"
    textColor: "{colors.moss-ink}"
    typography: "{typography.pixel}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "40px"
  export-bar:
    backgroundColor: "{colors.meadow-sheet}"
    textColor: "{colors.moss-ink}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "64px"
  export-download:
    backgroundColor: "{colors.grass-plate}"
    textColor: "{colors.meadow-paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  export-download-disabled:
    backgroundColor: "{colors.meadow-trough}"
    textColor: "{colors.moss-muted}"
  proof-tag:
    backgroundColor: "{colors.moss-ink}"
    textColor: "{colors.meadow-paper}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  cartridge-card:
    backgroundColor: "{colors.sun-plate}"
    textColor: "{colors.meadow-paper}"
    rounded: "{rounded.none}"
    padding: "12px"
  toast:
    backgroundColor: "{colors.meadow-paper}"
    textColor: "{colors.moss-ink}"
    rounded: "{rounded.none}"
    padding: "8px 8px 8px 12px"
  label-band:
    backgroundColor: "{colors.meadow-paper}"
    textColor: "{colors.moss-ink}"
    rounded: "{rounded.none}"
    height: "64px"
---

# Design System: beexie

## Overview

**Creative North Star: "The Instruction Booklet"**

beexie is the booklet from the game box. The landing is its cover and spreads: a cover plate with a live sprite, numbered "how to play" panels with leader-line callouts on diagrams of real controls, cartridge-label preset cards, a safety page, a Q and A, and a back cover. The Studio is the same booklet opened flat on the desk: the image is the page, the controls are its labeled diagram, and an export bar runs along the bottom edge. Light theme is meadow paper (a faint green-white stock, moss ink); dark theme is the moss shell carrying the same plates as label art. The palette is lifted from one blocky sunset: sun orange, gold, grass green, and tide teal over moss.

Everything is printed, not lit. Color arrives as flat plates (sun, gold, grass, tide) that own whole regions: a tab, a panel head, a card, a page. Edges are square, rules are moss ink, and the sprite is the specimen: rendered by the real pipeline at a true integer scale inside a 3px moss key line. Empty space is never blank; it is a ghost cell grid waiting to be filled. Readouts sit in fixed slots in a fixed-width pixel face, so numbers change without anything reflowing.

Motion has one register. The two large art plates are voxel scenes drawn on a 120 px tall canvas at true pixel scale: a blocky sunset on the cover and the same world after dusk on the back cover. Their clouds drift a pixel at a time, the water glint swaps frames, and stars blink one by one. Every UI change snaps in `steps()` like a sprite too: tabs flood in, swatches flip, readouts tick, the ghost grid fills row by row. Under `prefers-reduced-motion` the scenes hold one still frame and every stepped change is instant.

**Key Characteristics:**
- Meadow paper (`#f8fbf4`) and moss shell (`#141c16`) themes; plates keep their hue across themes and lift in the shell; all 45 contrast pairs in `npm run check:contrast` pass WCAG AA.
- Flat spot plates and hard-stop fills only; no blended gradients, no shadows, no blur, no rounded corners.
- Heavy Japanese-style gothic display (Dela Gothic One) over a clean gothic UI face (Zen Kaku Gothic New), with DotGothic16 reserved for numerals, readouts, and sprite captions.
- Sprites printed by the real pipeline at `floor(available / cells) * cells`, so every art pixel is the same size, always `image-rendering: pixelated`.
- One motion register: art plates and UI both move in steps.

## Colors

Two grounds (meadow paper and moss shell), moss ink, four plates taken from the voxel sunset whose meaning is fixed per role, a danger red kept apart from them, and the scene colors of the two art plates.

### Primary
- **Grass Plate** (`grass-plate`, light; `grass-on-shell`, dark): the action plate. Fills every primary button and the Studio Download button, the Color stage plate, the cover CTA hover, the success toast badge, focus rings and caret, and the cover plate while a file is dragged over it. White text on it in light (5.33:1), shell text on it in dark (9.02:1). Success shares it; success messages always carry text.

### Secondary
- **Sun Plate** (`sun-plate`, light; `sun-on-shell`, dark): the Image stage plate, the compare rule and its handle, the empty-bench CTA, and the bee mark's tail stripe. Always carries moss ink text (4.74:1 light, 7.42:1 dark). Text-grade orange is **Sun Text** (`sun-text`, light) and **Sun Text on Shell** (`sun-text-on-shell`, dark), used for headline emphasis.
- **Gold Plate** (`gold-plate`): the Grid stage plate and the "attention" fill: toggle-on thumb, the processing tag, the drop overlay card, the Saved stamp, text selection, slider thumb hover, the neutral toast badge, and the whole safety page. Always carries ink text (10.36:1 light, 12.04:1 dark).
- **Tide Plate** (`tide-plate`, light; `tide-on-shell`, dark): the Finish stage plate and How to play panel 4. White text in light (4.61:1), shell text in dark (7.10:1).

### Tertiary
- **Danger** (`danger`, light; `danger-on-shell`, dark): error alerts, the error toast badge, palette errors, danger notes, oversized outputs. A red kept clear of the sun orange so an error never reads as the Image plate. Alerts carry white text in light and shell text in dark.
- **Voxel scene colors** (`sunset-sky-top`, `sunset-glow`, `dusk-sky-top`, and the full tables in `VOXEL_SCENES`): the cover and back cover art, the same in both themes. Chips on the plates are fixed paper and moss ink (`--chip`, `--chip-ink`); the back cover title in chip paper holds at least 4.8:1 against every dusk sky band.

### Neutral
- **Meadow Paper** (`meadow-paper`): page ground, label band, inspector, inputs, cards on the page, toasts, the cover's right column.
- **Meadow Sheet** (`meadow-sheet`): thumb-tab strip, export bar, canvas surround, hover wells, dropzone fill, scrollbar track.
- **Meadow Trough** (`meadow-trough`): slider trough and the disabled Download fill.
- **Moss Ink** (`moss-ink`): text, rules, pressed segments, proof tags, and the cover CTA. **Keyline** (`keyline`) frames sprites, callouts, and swatch strips sitting on plates.
- **Moss Muted** (`moss-muted`): hints, descriptions, labels on the export bar (6.83:1 on paper).
- **Soft Rule** (`soft-rule`): dividers between inspector groups and readout rows; the only rule lighter than ink.
- **Checker Light A / B** and **Ghost Cell**: 16px transparency checker behind processed alpha, and the 1px lines of the ghost grid.
- **Moss Shell** (`moss-shell`), **Moss Shell Sheet**, **Moss Shell Trough**: the dark-theme counterparts of paper, sheet, and trough.
- **Shell Ink** (`shell-ink`) and **Shell Muted Ink** (`shell-muted-ink`): dark-theme text (15.93:1 and 8.80:1 on the shell).
- **Shell Rule** (`shell-rule`, 5.96:1 on the shell) and **Shell Soft Rule** (`shell-soft-rule`): dark-theme rules.
- **Scrim** / **Scrim on Shell**: the overlay behind the drop overlay, dialogs, and the crop editor's outside area.

### Named Rules
**The Stage Plate Rule.** In the Studio, the stage in use owns one plate (Image sun, Grid gold, Color grass, Finish tide) and only the stage furniture takes it: the open thumb tab, the inspector numeral, the active grid preset, and the Pixel proof tag. Every other color on screen is ink, paper, or a fixed-role plate.

**The Fixed Roles Rule.** In UI, outside the stage plate, each plate means one thing: grass is the action, sun is the compare rule, gold is attention (on, busy, selected, saved), danger is errors. Only label art may use plates freely: the landing cover, How to play heads, cartridge cards, the safety page, and the back cover.

**The Text-Grade Rule.** Plates are fields; text on paper uses the text-grade variant (`sun-text`, `sun-text-on-shell`). Sun orange and gold never set small text on paper.

**The One Sunset Rule.** Every plate color appears in the voxel scene. A new color earns its place by existing in that sunset first.

## Typography

**Display Font:** Dela Gothic One (fallback: Zen Kaku Gothic New, sans-serif)
**Body Font:** Zen Kaku Gothic New 400 and 700 (fallback: ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** DotGothic16 (fallback: ui-monospace, monospace)

**Character:** The heavy gothic of a booklet cover over a plain gothic for reading and controls, with a dot-matrix face that only ever prints numbers and captions. All three are self-hosted woff2 subsets in `src/assets/fonts/`.

### Hierarchy
- **Display** (Dela Gothic One 400, `clamp(44px, 5vw, 84px)`, 1.1, `-0.02em`, max 11ch): the cover headline only. The back cover title ("Your turn.") runs larger at `clamp(44px, 7vw, 96px)`, line-height 1.
- **Headline** (Dela Gothic One 400, `clamp(32px, 4vw, 56px)`, 1.05, `-0.015em`): spread titles (How to play, presets, Q and A). The safety page title runs `clamp(36px, 4.4vw, 64px)`.
- **Title** (Dela Gothic One 400, 20px): inspector stage heading, cartridge card names, empty-bench title, legal dialog title, and the wordmark (20px in the Studio, 24px on the landing band). The export bar title and Saved stamp use it at 16px.
- **Body** (Zen Kaku Gothic New 400, 14px, 1.55): running copy. The cover pitch and spread leads set at 16px; the cover pitch and Q and A answers run at line-height 1.65, capped at 44ch and 62ch.
- **Label** (Zen Kaku Gothic New 700, 13px; 12px for hints, tab labels, and rim labels): secondary buttons, field heads, segmented options, proof tags, and toasts. Primary and Download buttons carry the same weight at the 14px body size. Sentence case, normal tracking, never uppercase.
- **Pixel** (DotGothic16 400, 16px, `+0.02em`): readouts, number inputs, field values, zoom percent, hex codes, grid preset counts (20px), callout letters, and sprite captions.
- **Numeral** (DotGothic16 400, 30px, line-height 1): thumb-tab numbers (22px when the tabs become a strip), the inspector numeral (22px), How to play panel numbers (44px), and safety page numbers (32px).

### Named Rules
**The Pixel Face Rule.** DotGothic16 prints numbers, readouts, codes, lettered callout marks, and short captions, including numeric controls (grid size chips, preset counts, zoom percent). It never sets body copy, headings, or worded labels.

**The Fixed Slot Rule.** Every changing number sits in a slot of fixed width (`min-width: 8ch` on rim readouts, `13ch` on the export Output, 64px on zoom percent) in the fixed-width pixel face, so values tick without moving their neighbors.

**The Plain Weight Rule.** Display type is used at weight 400 only (Dela Gothic One has one weight); emphasis in UI copy is Zen Kaku Gothic New 700. No uppercase transforms, no wide tracking.

## Layout

**Landing (the booklet).** A sticky 64px label band (bee mark, wordmark, How to play / Presets / FAQ, theme toggle, Open Studio) sits on a 2px ink rule. The cover is an `11fr / 9fr` split: the voxel sunset plate on the left with the sprite, callouts, and swatch strip pinned to its right edge, and the paper column on the right with headline, pitch, cover button, and drop target. The cover's height is `clamp(600px, calc(100svh - 284px), 860px)` so How to play panel 1 peeks above the fold. The sprite box (486px max, 480 art px plus key line, divisible by every cover grid) breaks the plate edge into the paper column by up to 112px. Spreads follow with 72px vertical padding and `clamp(16px, 4vw, 48px)` gutters, each closed by a 2px rule: How to play (four panels in a ruled 4-column grid), five cartridge cards, the gold safety page (`2fr / 3fr`), a two-column Q and A, the voxel dusk back cover (at least `clamp(300px, 34vw, 480px)` tall so sky, moon, water, and island all show), and a colophon.

**Studio (the booklet opened flat).** A full-viewport grid: 52px label band, the bench, and a 64px export bar. The bench is three columns: 72px thumb-index tabs, the workspace, and a 400px full-height inspector (360px below 1380px). The workspace stacks a 52px view strip (view mode, touch-up, zoom), the page (ghost grid when empty, the proof framed in a 2px rule when loaded, 24px padding), and a 40px rim of fixed readout slots. The export bar spans the full width under the bench and is always visible, so settings never compete with export for height.

**Responsive.** Below 1180px the Studio stacks: header sticky, tabs become a horizontal strip (sticky under the header), the workspace holds a fixed `min(72vh, 680px)` height, the view strip wraps onto two rows, the inspector follows, and the export bar sticks to the bottom with Output and Download on its first row and the controls wrapping below. Below 760px the tabs stop sticking, the workspace drops to `min(60vh, 520px)`, Output hides (the rim already shows it), and the export controls fold behind a disclosure. On the landing, below 1180px How to play goes 2 by 2 and cards go three across; below 960px the cover stacks with the copy first; below 760px the band links hide, panels stack, and cards go two across. At 1280px and wider the cover callouts stand off the sprite in open plate space, joined by leader lines. Coarse pointers lift segmented options, zoom buttons, Download, toast close, and the slider to a 44px minimum, and palette chips to 36px.

**Spacing.** A 4px scale from 4px to 32px, then 48px and 72px for spread rhythm. Inspector groups pad 20px; stage padding is 24px.

## Elevation & Depth

None. The system is flat: no `box-shadow` anywhere, no blur, no translucency on UI. Depth is printed: a 2px ink rule separates the major regions (band, tabs, inspector, export bar, spreads), a 1px rule subdivides inside them, a plate flood marks what is in front, and the open thumb tab overlaps the tab-strip rule by 2px so it reads as a tab cut into the page. Overlays (drop overlay, legal dialog) sit on a flat scrim with a 2px ink border. The voxel scenes on the two art plates are the only pictures that are not pipeline output, and they stay behind the art.

### Named Rules
**The Printed Depth Rule.** If something needs to read as on top, give it a plate, a heavier rule, or an overlap. Never a shadow.

## Shapes

Every UI corner is square (`0px`), including inputs, color wells, toggles, slider thumbs (a 16 by 20px block), swatches, toasts, and dialogs. Borders are either the 1px hairline or the 2px stroke, always solid ink, except drop targets, which use a 2px dashed rule that turns solid on hover. Sprites wear a 3px moss key line; callouts and swatch strips on plates wear a 2px key line. The comparison handle is a 20 by 36px sun block with a 2px paper border; its focus ring wraps the handle. The ready lamp is an 8px square. The only curves in the system belong to the bee mark (rounded body, round wing caps) and the 24px line icons, which use square caps and miter joins at stroke width 2.

## Components

### Buttons
Flat, square, decisive. Every button changes color in two steps on hover (`120ms steps(2)`).
- **Shape:** square (`0px`).
- **Primary:** grass plate with white text (shell text in dark), 44px tall, 20px side padding, Zen 700. Hover inverts to ink with paper text.
- **Cover button:** ink with paper text, 60px tall, 18px label with a trailing arrow; hover floods grass. On the back cover it inverts to chip paper over the dusk scene, hovering to ink.
- **Secondary / ghost / icon:** 1px ink rule on paper, 36px tall (icon buttons 36px square); hover inverts to ink.
- **Quiet / text:** underlined text at a 1px weight, thickening to 2px on hover.
- **Focus:** 2px grass outline (light) or grass-on-shell outline (dark) at 2px offset, on every interactive element.
- **Disabled:** 45% opacity; the Download button instead drops to the trough fill with pencil-grey text and shows its reason in an ink slip above it.

### Chips and segmented controls
- **Segmented:** a 1px ruled strip of 34px options divided by hairlines; the pressed option inks solid (ink fill, paper text). Hover on unpressed options takes the sheet fill.
- **Grid presets:** a 3-column ruled grid of blocks, each a pixel-face count over a small hint. The active block takes the stage plate.
- **Palette chips:** 28px square swatches in a 1px rule; hover outlines 1px, selected outlines 2px at 2px offset.
- **Callout chips (cover):** lettered label strips clipped to the sprite rim: an ink letter cell, then 40px chips; pressed chips ink solid, hovered chips go gold. The grid and color caption below the sprite sits on an ink chip, since the scene behind it changes.

### Cards / Containers
- **Corner Style:** square.
- **Cartridge cards:** the five retro presets, each a whole plate (sun, gold, grass, ink, sun) in a 2px rule, with the preset name in the display face, the live color count in the pixel face, and the koi rendered by that preset at 64 cells. Hovering a card rotates its palette (stepped, about 8 frames a second).
- **How to play panels:** a plate head with a 44px pixel numeral and title, a bold lead, a ghost-gridded diagram of the real control with lettered marks joined by 1px leader lines ending in a square dot, and a lettered legend.
- **Inspector groups:** no boxes; groups pad 20px and divide with a soft rule.
- **Shadow Strategy:** none (see Elevation & Depth).

### Inputs / Fields
- **Style:** 40px number and color fields in a 1px ink rule on paper, values in the pixel face, unit suffix in pencil grey; selects are 38px with a drawn chevron; the toggle is a 40 by 22px square lamp whose 16px thumb jumps 18px and turns gold on an ink track; the slider is a 4px ruler filled with ink up to the value.
- **Focus:** 2px focus outline around the whole field (`focus-within`).
- **Error / Disabled:** errors are a danger alert with white bold text (shell text in dark) and an underlined dismiss; danger notes and oversized outputs switch to the danger text color. Disabled fields drop to 45% opacity.

### Navigation
- **Landing label band:** 64px, sticky, 2px rule beneath, bold 13px links that underline at 2px on hover, the Open Studio primary button at 40px.
- **Studio label band:** 52px, bee mark and wordmark (underlines on hover), an Overview ghost button, the file chip (24px thumbnail plus name), New project, and the theme toggle.
- **Thumb-index tabs:** four 84px tabs on the sheet strip, each a 30px pixel numeral over its label. The open tab floods its stage plate and overlaps the strip's rule. Below 1180px they become a horizontal strip with the numeral beside the label.

### Sprite and ghost grid (signature)
The landing sprite runs the real pipeline on the koi specimen (or a dropped image) at a square grid, sized to an exact integer multiple of its cells, inside a 3px key line. Before pixels arrive, the cell is a ghost grid: 1px ghost-cell lines at the current cell size. When a result lands, a ghost-grid overlay retracts row by row (`420ms`, one step per row, 4 to 32 rows), revealing the art in scanline order. The Studio proof uses the same fill on every reprocess. The cover shows the extracted palette under the sprite as a 16-column swatch strip in a key line.

### Rim readouts and export bar
Readouts (grid, output, colors, status) sit on the canvas bottom rim in fixed slots and roll to new values in six 30ms steps, like a sprite counter. Proof captions sit on the top rim: an ink tag on the left, a stage-plate tag on the right; a gold tag marks processing. The export bar holds Format, Scale, and Background (Clear or Fill, with a fill color) as labeled segmented groups, then the Output readout and the Download button. While encoding, Download shows a stepped grass and ink stripe; on success a gold "Saved" stamp prints over it at a slight tilt, then clears.

### Motion
**Art plates (steps).** `VoxelPlate.tsx` draws an original blocky landscape on a canvas 120 px tall and 192 to 520 px wide (the plate's aspect decides; the 192 px tile repeats), shown with `object-fit: cover` and `image-rendering: pixelated`. Layers: stepped sky bands with a one-row checker dither at each seam, a block sun with a glow ring (dusk: a block moon and stars), cloud slabs with lit undersides, far and near ranges in 4 and 6 px columns, water with the orb's reflection in stepped rows, and an island of 8 px grass and dirt blocks with block trees. One 600ms interval drives it: clouds move a pixel each tick, the glint swaps every 900ms, a star blinks every 1.2s. It pauses off screen and in hidden tabs; under reduced motion it draws one still frame. During a drag over the cover the scene drops to 35% and the plate turns grass.

**UI register (steps).** Color swaps and toggle thumbs: `120ms steps(2)`. Toast rise: 8px in `120ms steps(2)`. Tab and stage panel flood: a clip-path wipe in `160ms steps(4)`. Palette cascade: each swatch flips in over `120ms steps(3)`, 22ms apart. Ghost grid fill: `420ms`, one step per row. Readout tick: 6 frames at 30ms. Encode stripe and marching drop-target dashes: `480ms steps(4)`, looping. Saved stamp: `1400ms steps(3)`. Theme switch: a View Transitions wipe down the page in `360ms steps(6)`. Bee wings: two-frame flap at 180ms on wordmark hover. Spinner: `0.8s steps(8)`. Reduced motion collapses all of it to instant.

## Do's and Don'ts

### Do:
- **Do** give the stage in use its plate (Image sun, Grid gold, Color grass, Finish tide) on its tab, numeral, active preset, and Pixel tag, and keep everything else ink and paper.
- **Do** keep grass for actions, sun for the compare rule, gold for on, busy, selected, and saved states, and danger for errors.
- **Do** draw with hard-stop fills: ghost grids, the checker, slider fill, and stripes are hard-edged `linear-gradient` stops, never blends.
- **Do** separate regions with a 2px ink rule and subdivide with a 1px rule; mark what is in front with a plate or an overlap.
- **Do** render every sprite and preview at a true integer scale with `image-rendering: pixelated`, inside a moss key line.
- **Do** put changing numbers in the pixel face inside fixed-width slots, and roll them in steps.
- **Do** animate UI in discrete steps (`steps()` in CSS, fixed-interval frames in script), and route every animation through the reduced-motion reset.
- **Do** keep the voxel scenes on the two landing art plates, set text on them as chips or as large display type checked against every sky band, and add any new plate pair to `scripts/check-contrast.cjs`.

### Don't:
- **Don't** use `box-shadow`, blur, glows, or blended gradients on any UI element.
- **Don't** round a corner; the bee mark and line icons are the only curves.
- **Don't** flood more than one stage plate at a time in the Studio, or put plate color on a control that is neither active stage furniture nor a fixed-role element.
- **Don't** use eased glides anywhere, art plates included; and don't draw scene art from another game's textures, blocks, names, or logos.
- **Don't** set body copy, headings, or worded labels in DotGothic16, and don't uppercase or letter-space labels.
- **Don't** fake pixel art with CSS filters or smoothing; every sprite on the page is real pipeline output.
- **Don't** print real console names, logos, seals, or trade dress on cards, labels, or copy.
