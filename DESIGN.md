---
name: "beexie: Spot-Ink Proof Studio"
description: "Dual-theme client-side image-to-pixel-art proof studio built on Cotton-Press Ivory and Pressroom Charcoal sheets with Electric Cobalt and Vermilion spot inks."
colors:
  electric-cobalt: "#1e46e8"
  electric-cobalt-hover: "#1737bf"
  cobalt-press-dark: "#2d55eb"
  cobalt-press-dark-hover: "#3b63f6"
  cobalt-ink-dark-text: "#85aaff"
  vermilion-proof: "#eb4a2d"
  vermilion-proof-text: "#c23117"
  vermilion-proof-dark: "#ff5a3c"
  vermilion-proof-dark-text: "#ff8770"
  proof-green: "#147a43"
  proof-green-dark: "#34d399"
  press-cyan: "#0369a1"
  press-cyan-dark: "#38bdf8"
  press-amber: "#a15206"
  press-amber-dark: "#fbbf24"
  press-danger: "#c23117"
  press-danger-dark: "#ff8770"
  cotton-ivory-paper: "#f8f6f1"
  press-sheet-white: "#ffffff"
  cotton-well: "#f1eee7"
  cotton-well-deep: "#e5e0d5"
  lampblack-ink: "#111317"
  press-frame-ink: "#15171c"
  graphite-ink: "#3d414a"
  slate-muted-ink: "#575b64"
  stone-rule: "#6b6860"
  parchment-hairline: "#dcd7cc"
  checker-light-a: "#eae6dc"
  checker-light-b: "#f7f4ec"
  pressroom-charcoal: "#12141a"
  pressroom-sheet: "#191c23"
  pressroom-well: "#222630"
  pressroom-well-deep: "#2b303d"
  pressroom-toast-deep: "#0b0d11"
  chalk-ink: "#f5f6f8"
  silver-ink: "#c6cbd6"
  pewter-muted-ink: "#9ea5b5"
  charcoal-rule: "#8c92a0"
  charcoal-hairline: "#2d323e"
  checker-dark-a: "#20242d"
  checker-dark-b: "#181b22"
  specimen-cerulean: "#2aa3c7"
  specimen-lily-green: "#457842"
  specimen-koi-amber: "#f29e38"
  specimen-lotus-rose: "#df649c"
  specimen-cream: "#f8f5ee"
  mono-sepia-ink: "#221a0b"
  mono-sepia-cream: "#f6edd8"
  preset-gameboy-deep: "#0f380f"
  preset-gameboy-mid: "#306230"
  preset-gameboy-olive: "#8bac0f"
  preset-gameboy-lime: "#9bbc0f"
typography:
  display:
    fontFamily: "'Bricolage Grotesque', 'Archivo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.1vw, 52px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.032em"
  headline:
    fontFamily: "'Bricolage Grotesque', 'Archivo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Bricolage Grotesque', 'Archivo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Archivo', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "'Martian Mono', ui-monospace, 'SFMono-Regular', 'Cascadia Code', Consolas, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
rounded:
  tag: "4px"
  sheet-inner: "4px"
  sm: "6px"
  seg-inner: "6px"
  md: "8px"
  seg: "9px"
  lg: "12px"
  sheet: "14px"
  pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "20px"
  s-6: "24px"
  s-7: "32px"
  s-8: "40px"
components:
  button-primary:
    backgroundColor: "{colors.electric-cobalt}"
    textColor: "{colors.press-sheet-white}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.electric-cobalt-hover}"
  button-secondary:
    backgroundColor: "{colors.press-sheet-white}"
    textColor: "{colors.lampblack-ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-ghost:
    backgroundColor: "{colors.press-sheet-white}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.sm}"
    padding: "7px 12px"
  button-icon:
    backgroundColor: "{colors.press-sheet-white}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.sm}"
    width: "32px"
    height: "32px"
  rail-tool:
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.md}"
    padding: "9px 4px"
    width: "48px"
  rail-tool-active:
    backgroundColor: "{colors.electric-cobalt}"
    textColor: "{colors.press-sheet-white}"
  chip-pill:
    backgroundColor: "{colors.cotton-ivory-paper}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-pill-active:
    backgroundColor: "{colors.electric-cobalt}"
    textColor: "{colors.press-sheet-white}"
  segmented-track:
    backgroundColor: "{colors.cotton-ivory-paper}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.seg}"
    padding: "3px"
  segmented-option:
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.seg-inner}"
    padding: "5px 10px"
  card-proof-sheet:
    backgroundColor: "{colors.press-sheet-white}"
    rounded: "{rounded.sheet}"
    padding: "10px"
  card-dropzone:
    backgroundColor: "{colors.cotton-ivory-paper}"
    rounded: "{rounded.lg}"
    padding: "20px 12px"
  input-number:
    backgroundColor: "{colors.cotton-ivory-paper}"
    textColor: "{colors.lampblack-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "32px"
  export-ticket:
    backgroundColor: "{colors.press-sheet-white}"
    rounded: "0px"
    padding: "12px 20px 16px"
  nav-header:
    backgroundColor: "{colors.press-sheet-white}"
    textColor: "{colors.lampblack-ink}"
    height: "54px"
    padding: "0 20px"
---

# Design System: beexie

## Overview

**Creative North Star: "The Spot-Ink Proof Studio"**

beexie treats browser-side pixel art conversion like inspecting a calibrated Risograph proof on a press bench. Warm Cotton-Press Ivory (`#f8f6f1`) and crisp white press sheets (`#ffffff`) form the daylight drafting ground, while the paired Pressroom Charcoal (`#12141a`) and dark sheet (`#191c23`) theme supports low-glare color inspection. Electric Cobalt (`#1e46e8` light / `#2d55eb` dark) marks every active commitment and export action, while Proof Vermilion (`#eb4a2d` light / `#ff5a3c` dark) stays scoped to comparison and live indicators: the split comparison rule, the Landing dither switch track, the active-session pulse dot, and the tail stripe of the geometric `<BeeMark />` emblem.

Across both the Landing showcase and the Studio workbench, structural separation relies on crisp `1px` hairlines (`#dcd7cc` light / `#2d323e` dark), spacing-grouped sections (`.panel-group`) instead of nested boxes, concentric radii governed by `inner = outer - padding`, pure Electric Cobalt pointer-tracking Spotlight cards (`[data-spotlight]`), and mirrored flowing cubic-Bezier `BackgroundPaths` ribbons (`Path2D` Canvas 2D). On Landing, 72 symmetric curves sweep gently behind an interactive split proof of the 1024x1024 koi pond specimen (`public/specimen.jpg`) and framed `.pipeline-sheet-frame` / `.faq-sheet-frame` proof sheets. Inside the Studio workbench, `BackgroundPaths` pauses to a calm static frame while a `64px` numbered `01-04` rail frees the center bench for nearest-neighbor previews (`image-rendering: pixelated`) and a pinned dashed-rule Export ticket.

**Key Characteristics:**
- Dual-theme press calibration: Cotton-Press Ivory (`#f8f6f1`) for daylight drafting and Pressroom Charcoal (`#12141a`) for low-glare proofing, passing all 18 WCAG AA contrast checks.
- Spot-ink role discipline: Electric Cobalt owns action, selection, and pure-accent Spotlight Card radial glow; Proof Vermilion marks compare sliders, the dither switch, the session dot, and the bee tail accent.
- Strict mono-only-on-data typography: `Archivo` owns UI labels and headings in sentence case while `Martian Mono` with `tabular-nums` renders only numeric coordinates, grid counts, zoom percentages, hex codes, and `01-04` stage indices.
- Mathematical nested geometry: concentric sheets and segmented controls compute inner corners directly from outer radius minus padding (`14px - 10px = 4px`, `9px - 3px = 6px`).
- Motion restraint and loading clarity: flowing `BackgroundPaths` curves and Cobalt pointer Spotlight border/surface tracking on Landing (disabled on coarse touch pointers), static framing in Studio, unified `strokeWidth={1.75}` SVG spinners (`SpinnerIcon`) across specimen decode and pixel processing, and global `0s` transitions / static backdrop under `prefers-reduced-motion: reduce`.

## Colors

A high-contrast neutral paper-and-ink palette calibrated across Light and Dark press themes, paired with Electric Cobalt for interactive commitment, Proof Vermilion for inspection gauges, semantic press indicators, and specimen/preset palette swatches.

### Primary
- **Electric Cobalt** (`#1e46e8`) / **Electric Cobalt Hover** (`#1737bf`): Light-theme interactive fill for primary launch and export CTAs, active `01-04` rail tools, active grid preset tiles, active slider tracks, active Studio toggles, active segmented tabs, selection highlights, and focus rings.
- **Cobalt Press Dark** (`#2d55eb`) / **Cobalt Press Dark Hover** (`#3b63f6`): Dark-theme button and active-tile fill calibrated so `#ffffff` labels achieve `5.82:1` contrast.
- **Cobalt Ink Dark Text** (`#85aaff`): Dark-theme text-safe cobalt used for `--accent-text` readouts, active aspect-chain icons, active grid-line chips, and `--focus-ring` outlines (`8.06:1` on `#12141a`, `7.46:1` on `#191c23`).

### Secondary
- **Vermilion Proof** (`#eb4a2d`) / **Vermilion Proof Dark** (`#ff5a3c`): High-visibility spot ink reserved for the `2.5px` split comparison rule and `24x40px` `||` handle, Landing's active Floyd-Steinberg dither switch track, the `Resume` indicator dot, the fifth swatch of the Landing ink ribbon, and the bottom stripe of `<BeeMark />`.
- **Vermilion Proof Text** (`#c23117` light / `#ff8770` dark): WCAG AA text-safe vermilion tokens (`--vermilion-text` and `--danger`, achieving `5.61:1` light and `7.27:1` dark contrast on `--panel`).

### Tertiary
- **Proof Green** (`#147a43`) / **Proof Green Dark** (`#34d399`): Ready indicator dot (`.ready-dot`) in the Studio bottom status board when pixel processing is idle.
- **Press Cyan** (`#0369a1`) / **Press Cyan Dark** (`#38bdf8`): Semantic cool telemetry token (`--cyan`) verified at `5.49:1` light and `8.59:1` dark contrast on `--paper`.
- **Press Amber** (`#a15206`) / **Press Amber Dark** (`#fbbf24`): Semantic warm warning token (`--amber`) verified at `5.22:1` light and `11.03:1` dark contrast on `--paper`.
- **Press Danger** (`#c23117`) / **Press Danger Dark** (`#ff8770`): Inline upload validation alert banners (`.alert`), toast error indicators, and oversized-dimension warnings in the Export ticket and Finish panel.
- **Specimen & Default Preset Swatches**: Landing's 8-swatch ink ribbon (`LandingFeatures.tsx`) combines `Lampblack Ink` (`#111317`), `Electric Cobalt` (`#1e46e8`), `Specimen Cerulean` (`#2aa3c7`), `Specimen Lily Green` (`#457842`), `Vermilion Proof` (`#eb4a2d`), `Specimen Koi Amber` (`#f29e38`), `Specimen Lotus Rose` (`#df649c`), and `Specimen Cream` (`#f8f5ee`), mirroring the koi pond palette in `LandingHero.tsx`. Studio's Color panel ships default monochrome swatches (`#221a0b` / `#f6edd8`), the Game Boy default custom palette (`#0f380f`, `#306230`, `#8bac0f`, `#9bbc0f`), plus PICO-8, CGA, Sepia, and Gray 8 conversion presets in `src/constants.ts`.

### Neutral
- **Cotton-Press Ivory** (`#f8f6f1`): Light ground (`--paper`), inset field/segmented/dropzone fill, and toast inverse text (`--wax`).
- **Press Sheet White** (`#ffffff`): Elevated Light sheet, header, rail, inspector, modal, and export ticket surface (`--panel`, `--ticket`).
- **Cotton Well** (`#f1eee7`) / **Cotton Well Deep** (`#e5e0d5`): Light hover wells, hero loading veil (`--panel-2`), and unfilled slider track troughs (`--panel-3`).
- **Lampblack Ink** (`#111317`) / **Press Frame Ink** (`#15171c`): Light primary text, active zoom/mode dark pills, toast backdrop (`--ink`, `--deep`), and strong proof viewport frame border (`--line-strong`).
- **Graphite Ink** (`#3d414a`) / **Slate Muted Ink** (`#575b64`): Light secondary labels (`--ink-2`) and WCAG AA muted descriptions and hints (`--ink-3`, `5.87:1` on `--panel-2`).
- **Stone Rule** (`#6b6860`) / **Parchment Hairline** (`#dcd7cc`): Light interactive input/dropzone borders (`--line`, `5.56:1` on `--panel`) and subtle horizontal dividers (`--line-subtle`).
- **Checker Light A / B** (`#eae6dc` / `#f7f4ec`): `16x16px` transparency checkerboard rendered behind processed alpha pixels in Light mode.
- **Pressroom Charcoal** (`#12141a`): Dark ground (`--paper`) beneath flowing `#d4d9e6` `BackgroundPaths` linework in Dark mode.
- **Pressroom Sheet** (`#191c23`): Dark elevated surface for panels, header, inspector, and export ticket (`--panel`, `--ticket`).
- **Pressroom Well** (`#222630`) / **Pressroom Well Deep** (`#2b303d`): Dark hover wells, hero loading veil (`--panel-2`), and slider track troughs (`--panel-3`).
- **Pressroom Toast Deep** (`#0b0d11`): Dark toast pill background (`--deep`).
- **Chalk Ink** (`#f5f6f8`) / **Silver Ink** (`#c6cbd6`) / **Pewter Muted Ink** (`#9ea5b5`): Dark primary (`--ink`), secondary/frame (`--ink-2`, `--line-strong`), and muted (`--ink-3`, `6.13:1` on `--panel-2`) typography ramp.
- **Charcoal Rule** (`#8c92a0`) / **Charcoal Hairline** (`#2d323e`): Dark interactive borders (`--line`, `5.47:1` on `--panel`) and structural hairlines (`--line-subtle`).
- **Checker Dark A / B** (`#20242d` / `#181b22`): Dark `16x16px` transparency checkerboard tiles behind alpha artwork.

### Named Rules
**The Dual-Ink Economy Rule.** Electric Cobalt (`#1e46e8` light / `#2d55eb` dark) owns interactive commitment (primary CTAs, active stage rail tile, active presets, active segmented views, toggles, focus rings) and pure-accent `[data-spotlight]` card perimeter/surface glows; Proof Vermilion (`#eb4a2d` light / `#ff5a3c` dark) stays scoped to inspection markers (compare split rule and handle, Landing dither switch track, `Resume` pulse indicator, and `<BeeMark />` tail stripe) while text-grade `--vermilion-text` (`#c23117` light / `#ff8770` dark) handles readable danger/alert copy.

**The Dual-Theme Contrast Parity Rule.** Light Cotton-Press Ivory and Dark Pressroom Charcoal pair distinct fill, text, and rule tokens (`--accent` `#1e46e8` / `#2d55eb` vs. `--accent-text` `#1e46e8` / `#85aaff`, `--ink-2` `#3d414a` / `#c6cbd6`, `--ink-3` `#575b64` / `#9ea5b5`, `--vermilion-text` `#c23117` / `#ff8770`) so all 18 WCAG AA checks (`>= 4.5:1` text, `>= 3.0:1` UI borders) pass simultaneously.

**The Calm Pressroom Backdrop Rule.** The `BackgroundPaths` canvas renders smooth sweeping `#1e2330` (light) / `#d4d9e6` (dark) cubic-Bezier paths on Landing and pauses into faint static guide geometry inside the Studio workbench (and under `prefers-reduced-motion: reduce`) while `[data-spotlight]` cards restrict glow purely to Electric Cobalt on fine-pointer hover so ambient motion never distorts pixel color evaluation.

## Typography

**Display Font:** Bricolage Grotesque (fallback: Archivo, ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo (fallback: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif)
**Label/Mono Font:** Martian Mono (fallback: ui-monospace, 'SFMono-Regular', 'Cascadia Code', Consolas, monospace)

**Character:** Self-hosted WOFF2 geometric display type paired with a crisp grotesque UI sans for human-readable labels and strictly tabular monospace exclusively for quantitative telemetry so live slider scrubbing and viewport scaling never trigger layout jitter.

### Hierarchy
- **Display** (weight `800`, `clamp(34px, 4.1vw, 52px)`, up to `3.25rem`, line-height `1.05`, tracking `-0.032em`, `max-width: 13ch`, `text-wrap: balance`): Landing hero statement (`Turn photos into exact pixel art, locally.`).
- **Headline** (weight `800`, `--fs-headline: 24px` in Studio; `clamp(24px, 2.8vw, 32px)` on Landing sections; `clamp(22px, 2.6vw, 28px)` on Footer CTA; line-height `1.15`, tracking `-0.025em` / `-0.02em`): Studio empty-bench prompt, Landing section headings (`Four deterministic press stages`, `Frequently asked questions`), and `22px` (`--fs-wordmark` / `--fs-xl`) lowercase `beexie` brand wordmark (`-0.03em` tracking).
- **Title** (weight `800`, `--fs-title` / `--fs-lg: 17px`, line-height `1.2`-`1.25`, tracking `-0.015em`): Studio inspector stage headings (`Image`, `Grid`, `Color`, `Finish`) and sequential pipeline step headings.
- **Body** (`--fs-base: 13px` default / `--fs-sm: 12px` compact UI / `--fs-md: 14px` section subcopy / `15.5px` Landing hero subcopy, weight `400` prose and `600`-`700` UI labels, line-height `1.45`-`1.6`, max measure `44ch`-`62ch`): Control field labels, toggle descriptions, FAQ answers, modal copy, and status text in `Archivo` sentence case.
- **Label / Telemetry** (`--fs-xs: 11px` default, `10px` rail index, `10.5px` unit suffix, weight `600`-`700`, `Martian Mono` with `font-variant-numeric: tabular-nums`): Numeric inputs, slider readouts, zoom controls, proof viewport tags, hex swatches, `01`-`04` stage indices, status telemetry (`Grid`, `Output`, color count), and Landing grid pills.

### Named Rules
**The Strict Mono-Only-On-Data Rule.** UI chrome labels, field heads, preset sub-captions, stage names, and ticket headings remain in `Archivo` (`--font-ui`, sentence case), reserving `Martian Mono` (`--font-mono`) strictly for numeric coordinates, grid dimensions, zoom percentages, hex codes, byte sizes, and `01`-`04` stage indices.

**The Tabular Telemetry Rule.** Every `Martian Mono` readout and numeric input enforces `font-variant-numeric: tabular-nums` (`.mono`, `.tnum`) so live slider scrubbing and viewport resizing never cause horizontal jitter.

**The Tight Display Tracking Rule.** `Bricolage Grotesque` headings (`800` weight) use tight negative letter-spacing (`-0.015em` to `-0.032em`) with `text-wrap: balance`, while `Archivo` body text and `Martian Mono` data values stay at normal tracking with zero forced uppercase transforms.

## Layout

Two purpose-built layouts share the same surface tokens and flowing `BackgroundPaths` canvas:

1. **Landing Showcase (`max-width: 1260px`, `24px` horizontal gutters):**
   - Sticky `60px` top navigation bar (`border-bottom: 1px solid var(--line-subtle)`) holding `<BeeMark size={26} />` + `beexie` wordmark, three anchor links (`Workbench`, `Pipeline`, `FAQ`), conditional `Resume` button with `7px` vermilion pulse dot, `ThemeToggle`, and `Open Studio` button (`36px` height).
   - Asymmetric two-column hero grid (`minmax(0, 0.84fr) minmax(0, 1.36fr)`, `40px` `--s-8` gap) pairing left display copy, `50px` primary cobalt CTA, and `48px` dashed drop tray (`max-width: 390px`) against a `4:3` interactive split proof sheet (`padding: 10px`, `14px` outer radius).
   - Framed four-column Pipeline Proof Sheet (`.pipeline-sheet-frame` on `--panel` with `14px` radius, `20px 24px` header band, and `repeat(4, minmax(0, 1fr))` hairline columns anchored by aligned footer spec/matrix/ribbon strips), framed Split FAQ Proof Sheet (`.faq-sheet-frame` mirroring the `0.84fr / 1.36fr` asymmetry with hairline accordion rows and rotating `<ChevronDownIcon />`), elevated footer CTA card, and colophon with Privacy / Terms / Licenses modal triggers.
   - Responsive collapse: below `1020px`, hero and `.faq-sheet-frame` stack to `1fr`, and pipeline shifts to `2x2` with hairline row dividers; below `680px`, nav anchor links hide, horizontal gutters narrow to `16px` (`--s-4`), pipeline collapses to `1fr` vertical rows, and palette swatches stack beneath the caption.

2. **Studio Workbench (`100dvh` full-bleed three-band shell):**
   - Slim `54px` header (`--header-h`) on `--panel` with clickable brand lockup, `<- Overview` ghost button, active specimen thumbnail chip (`22x22px` pixelated preview + filename), `New project` ghost button, and `ThemeToggle`.
   - Three-column `.bench` grid: `--rail-w: 64px` left numbered stage rail (`01 Intake`, `02 Grid`, `03 Color`, `04 Finish`), `minmax(0, 1fr)` center workspace (`--stagebar-h: 48px` `StageBar`, centered auto-fit `ProofFrame` inside `.proof-sheet`, bottom `StatusBoard`), and `--inspector-w: 360px` right inspector (`332px` below `1280px`) with spacing-grouped `.panel-group` sections (`20px` vertical rhythm, `1px` top dividers) and a pinned dashed-rule `ExportTicket` footer.
   - Responsive collapse: below `1180px`, `.bench` stacks vertically (`Workspace` order 1, horizontal `ToolRail` order 2, full-width `Inspector` order 3) and toasts dock to bottom; below `760px`, header wraps, zoom aligns right, and `.status-facts` becomes a 2-column grid; below `480px`, `.wordmark` shrinks to `19px`, `.empty-title` to `21px`, `.proof-sheet` tightens to `8px` padding and `12px` radius, and `.proof-tag-extra` hides. Coarse pointers (`pointer: coarse`) enforce `44px` minimum height on buttons, pills, toggles, and range sliders (`36px` on `.segmented-option`, `46px` on `.ticket-download`).

3. **Spacing Rhythm:** Built on a strict 4px base scale (`--s-1: 4px`, `--s-2: 8px`, `--s-3: 12px`, `--s-4: 16px`, `--s-5: 20px`, `--s-6: 24px`, `--s-7: 32px`, `--s-8: 40px`).

## Elevation & Depth

beexie pairs flat hairline-separated Studio inspector panes with elevated matte proof sheets (`.hero-proof-sheet`, `.pipeline-sheet-frame`, `.faq-sheet-frame`, `.footer-cta-card`, `.proof-sheet`) that illuminate cleanly with pure Cobalt pointer-tracking Spotlight glows (`[data-spotlight]`) above the flowing `BackgroundPaths` canvas. Inside panels and sheets, sections separate via `1px` `--line-subtle` hairlines and spacing rather than nested card boxes.

### Shadow Vocabulary
- **Proof Sheet & Card Frame (`--shadow-frame`):** Light `box-shadow: 0 12px 28px -16px rgba(17, 19, 23, 0.18)`; Dark `box-shadow: 0 14px 32px -12px rgba(0, 0, 0, 0.72)`. Applied to `.hero-proof-sheet`, `.pipeline-sheet-frame`, `.faq-sheet-frame`, `.footer-cta-card`, `.proof-sheet`, and `.empty-bench`.
- **Primary Action Lift (`--shadow-cta`):** Light `box-shadow: 0 8px 20px -8px rgba(30, 70, 232, 0.45)`; Dark `box-shadow: 0 8px 20px -8px rgba(45, 85, 235, 0.55)`. Applied to `.btn-hero-primary`, `.btn-footer-launch`, `.empty-cta`, and `.ticket-download`.
- **Overlay & Modal Lift (`--shadow-toast`):** Light `box-shadow: 0 10px 24px -10px rgba(17, 19, 23, 0.25)`; Dark `box-shadow: 0 12px 26px -8px rgba(0, 0, 0, 0.85)`. Applied to `.toast`, `.drop-card`, and `.legal-modal-panel` over `--scrim` (`rgba(17, 19, 23, 0.48)` light / `rgba(7, 9, 13, 0.72)` dark).
- **Compare Divider Handle:** Light `0 4px 12px rgba(17, 19, 23, 0.25)` on Landing / `0 4px 12px rgba(17, 19, 23, 0.28)` in Studio, separating the `24x40px` vermilion pill handle cleanly over mixed imagery.

### Named Rules
**The Hairline-First Layering Rule.** Structural panes and interior sheet subdivisions (`AppHeader`, `64px` `ToolRail`, `Inspector` `.panel-group` sections, `.pipeline-step` columns, and `.faq-row` accordion items) separate cleanly with `1px` `--line-subtle` hairlines and spacing; ambient `--shadow-frame` lift and pure-Cobalt `[data-spotlight]` glows are reserved exclusively for top-level matte proof sheets (`.hero-proof-sheet`, `.pipeline-sheet-frame`, `.faq-sheet-frame`, `.footer-cta-card`, `.proof-sheet`, and `.empty-bench`) so Landing copy never floats bare over the background paths.

## Shapes

Press-proof corners follow strict concentric geometry and crisp pixelated boundaries:
- **Nested Sheet Geometry (`--r-sheet: 14px`, `--p-sheet: 10px`, `--r-sheet-inner: 4px`):** Outer sheets (`.hero-proof-sheet`, `.pipeline-sheet-frame`, `.faq-sheet-frame`, `.proof-sheet`, `.empty-bench`, `.footer-cta-card`, `.legal-modal-panel`) wrap inner pixel viewports (`.proof`, `.hero-split-viewport`) whose radius equals `14px - 10px = 4px` (or `12px - 8px = 4px` below `480px`).
- **Nested Segmented Geometry (`--r-seg: 9px`, `--p-seg: 3px`, `--r-seg-inner: 6px`):** `.segmented`, `.ticket-seg`, and `.zoom` tracks wrap options and zoom cells with `9px - 3px = 6px` inner corners.
- **Tag & Swatch Radii (`--r-tag: 4px`, `3px` inner swatch):** Applied to `.proof-tag`, `.step-scale-bar .is-hot`, `.comb-cell` (`4px`), `.comb-hex` (`3px`), `.hero-swatch-chip` (`3px`), and `.project-thumb` (`3px`).
- **Compact Controls (`--r-sm: 6px`):** Applied to `.ghost-btn`, `.icon-btn`, `.btn-secondary`, `.number-input-wrap`, `.chain`, `.select`, `.readout`, `.project`, `.hero-grid-toggle`, and `.swatch-editor`.
- **Primary Actions & Rail Tiles (`--r-md: 8px`):** Applied to `.btn-primary`, `.btn-hero-primary`, `.btn-launch-atelier`, `.btn-footer-launch`, `.ticket-download`, `.tool` rail tiles, `.preset` tiles, `.dropzone-icon`, and `.source-image`.
- **Dropzones & Modals (`--r-lg: 12px`):** Applied to `.dropzone`, `.drop-card`, and mobile `.proof-sheet`.
- **Continuous Pills (`--r-pill: 999px`):** Applied to `.hero-grid-pill`, `.toggle-track`, `.range` track, `.divider-handle` / `.rule-handle`, `.processing`, and `.toast`.
- **Pixel & Vector Invariants:** Every pixel preview and `22x22px` project thumbnail enforces `image-rendering: pixelated` and `imageSmoothingEnabled = false`. All custom inline SVGs in `src/components/icons.tsx` (including `<CheckIcon />` at `12px`) share a unified `24x24` `strokeWidth={1.75}` round-cap frame, except `<BeeMark />` (`viewBox="0 0 32 28"`, `strokeWidth="1.9"` body/wings, `1.75` antennae, vermilion tail stripe).

### Named Rules
**The Nested Radii Parity Rule.** Nested containers obey `inner radius = outer radius - padding` (`--r-sheet` `14px` minus `--p-sheet` `10px` equals `--r-sheet-inner` `4px`; `--r-seg` `9px` minus `--p-seg` `3px` equals `--r-seg-inner` `6px`), keeping concentric frames optically parallel across every viewport and breakpoint.

## Components

### Buttons
Flat-pressed controls with crisp `140ms ease` color transitions and subtle scale (`0.98` / `0.985` / `0.96`) or `-1px` hover lift on landing CTAs.
- **Shape:** Primary buttons use `8px` (`--r-md`); secondary, ghost, and icon buttons use `6px` (`--r-sm`).
- **Primary (`.btn-primary`, `.btn-hero-primary`, `.btn-footer-launch`, `.ticket-download`):** `--accent` (`#1e46e8` light / `#2d55eb` dark) fill, `#ffffff` text, `10px 16px` padding (`50px` min-height in Hero, `40px` height on Export ticket) with `--shadow-cta`.
- **Hover / Focus:** Shifts to `--accent-hover` (`#1737bf` light / `#3b63f6` dark) with `scale(0.98)` on `:active`; global `:focus-visible` draws `2px solid var(--focus-ring)` with `2px` offset.
- **Secondary / Ghost / Icon / Quiet:** `.btn-secondary` (`1px solid var(--line)`, `--panel`, `8px 12px`), `.ghost-btn` (`1px solid var(--line-subtle)`, `--panel`, `7px 12px`), `.icon-btn` (`32x32px`), and `.text-btn` / `.btn-quiet` (underlined inline action with `3px` underline offset).

### Chips
Monospace resolution pills, 3-column grid presets, and compact color swatches.
- **Style:** `.hero-grid-pill` renders `--paper` background, `--ink-2` Martian Mono text, `1px solid var(--line-subtle)`, `6px 12px` padding, and `999px` radius. `.preset` tiles pair bold `tabular-nums` counts above `Archivo` hints (`8px 6px` padding, `8px` radius). `.comb-hex` swatches render `31x19px` rectangles with subtle alpha hairlines (`3px` radius).
- **State:** Active `.hero-grid-pill`, `.preset`, and `.tool` shift to `--accent` fill with `#ffffff` text; selected `.comb-hex` swatches show a `2px` `--accent` ring and `1.04` scale.

### Cards / Containers
Spacing-grouped inspector sections (`panel-group`) and elevated matte proof sheets without nested card clutter.
- **Corner Style:** `14px` (`--r-sheet`) for outer sheets (`.hero-proof-sheet`, `.pipeline-sheet-frame`, `.faq-sheet-frame`, `.proof-sheet`, `.empty-bench`, `.footer-cta-card`, `.legal-modal-panel`), `4px` (`--r-sheet-inner`) for nested pixel viewports, `12px` (`--r-lg`) for `.dropzone` and `.drop-card`.
- **Background:** `--panel` (`#ffffff` light / `#191c23` dark) for elevated sheets and inspector panes; `--paper` (`#f8f6f1` light / `#12141a` dark) for inset `.dropzone`, `.readout`, `.number-input-wrap`, `.faq-trigger:hover`, and `.segmented` wells.
- **Shadow Strategy:** Outer proof sheets and `.empty-bench` / `.footer-cta-card` use `--shadow-frame`; inspector `.panel-group` sections, `.pipeline-step` columns, and `.faq-row` blocks stay flat (`box-shadow: none`).
- **Border & Padding:** `1px solid var(--line-subtle)` (`1.5px dashed var(--line)` on dropzones); internal padding runs `10px` on `.proof-sheet` and `.hero-proof-sheet`, `16px 20px` on `.inspector-body` with `20px` `--s-5` gaps between `.panel-group` sections.

### Inputs / Fields
Sentence-case `Archivo` labels paired with `Martian Mono` numeric inputs and controls.
- **Style:** `.number-input-wrap` (`32px` height, `0 8px` padding, `1px solid var(--line-subtle)`, `6px` radius, `--paper` fill), `.select` (`32px` height, `6px` radius), `.color-input-wrap` (`24x24px` swatch + `code` hex), `.segmented` (`3px` padded `--paper` track, `9px` radius; `.mode-seg` and `.ticket-seg` invert active options to `--ink` / `--paper` while standard `.segmented` uses `--accent` / `#ffffff`), `.range` (`5px` gradient track with `15px` `--panel` thumb), and `.toggle` (`36x20px` pill track with `14px` white thumb).
- **Focus:** `.number-input-wrap:focus-within` shifts border to `--accent` with a `0 0 0 2px var(--accent-soft)` halo; keyboard focus-visible applies `2px solid var(--focus-ring)` with `2px` offset.
- **Error / Disabled:** `.alert` banners use `1px solid var(--danger)` over `--danger-soft`; disabled controls drop to `0.4` or `0.45` opacity and `cursor: not-allowed`.
- **Loading States:** `SpinnerIcon` (`0.85s linear infinite` `.icon-spin`) appears inside `.hero-loading-veil` while decoding the Landing specimen, inside `.processing` (`rgba(17, 19, 23, 0.88)` pill with `blur(6px)`) on the Studio proof frame, in `StatusBoard`, in `EmptyBench` / `ImagePanel` during image decode, and on the Export ticket button while encoding.

### Navigation
- **Landing Nav (`.landing-nav`):** Sticky `60px` bar on `--paper` (`max-width: 1260px` inner container) with `1px` bottom rule, `<BeeMark size={26} />` + `beexie` (`22px` Bricolage Grotesque 800), three anchor links (`Workbench`, `Pipeline`, `FAQ` hidden below `680px`), conditional `Resume` pill, `ThemeToggle`, and `Open Studio` cobalt button.
- **Studio Header (`.app-header`):** `54px` bar on `--panel` with `1px` bottom rule, clickable `<BeeMark size={26} />` + `beexie` (`22px` `--fs-wordmark`), `<- Overview` ghost button, active specimen chip (`22x22px` pixelated thumb + filename), `New project` ghost button, and `ThemeToggle`.
- **64px Stage Rail (`.rail`):** Vertical `64px` track on `--panel` (`border-right: 1px solid var(--line-subtle)`) housing four `48px`-wide `.tool` buttons (`01 Intake`, `02 Grid`, `03 Color`, `04 Finish`); turns into a horizontal row above the inspector below `1180px`.

### Signature Component: Export Ticket & Compare Rule
- **Export Ticket (`.ticket`):** Pinned at the foot of the right inspector beneath a `2px dashed var(--line)` tear-off border (`12px 20px 16px` padding, `--ticket` surface). Displays the `Archivo` `Export` header, three compact segmented rows (`Format`, `Scale`, `Alpha`), optional `Color` picker, a dashed `Output` readout (`1px dashed var(--line-subtle)`), and a `40px`-tall cobalt download CTA with `--shadow-cta`.
- **Compare Split Rule (`.rule` / `.demo-divider-rule`):** Full-height `2.5px` vertical Vermilion bar (`--vermilion`) centered on a `44px` hit strip and bisected by a `24x40px` pill handle (`||`, `2px solid #ffffff` border, `--vermilion` fill), operable via pointer drag or keyboard arrow keys (`0-100%`).

## Do's and Don'ts

### Do:
- **Do** group inspector and landing sections by `--s-5` / `--s-6` spacing and `1px` `--line-subtle` hairlines rather than wrapping nested cards inside cards.
- **Do** preserve `inner radius = outer radius - padding` (`14px - 10px = 4px` on proof sheets; `9px - 3px = 6px` on segmented tracks and zoom bars).
- **Do** keep UI field labels in `Archivo` sentence case and restrict `Martian Mono` (`tabular-nums`) strictly to pixel coordinates, dimensions, hex codes, zoom percentages, and `01`-`04` indices.
- **Do** enforce `image-rendering: pixelated` and `imageSmoothingEnabled = false` on every pixel-art preview and thumbnail.
- **Do** pause `BackgroundPaths` inside the Studio workbench, respect `prefers-reduced-motion: reduce` and `(pointer: coarse)` disables on hover spotlights, and pass all 18 checks in `npm run check:contrast`.

### Don't:
- **Don't** use Vermilion (`#eb4a2d` / `#ff5a3c`) for primary CTAs, stage rail buttons, or small text; reserve `--vermilion` for inspection markers and use `--vermilion-text` (`#c23117` / `#ff8770`) for alert and error text.
- **Don't** use `#85aaff` (`--accent-text`) as a dark-theme button fill behind `#ffffff` text; keep `#2d55eb` (`--accent`) as the dark button background and `#85aaff` for text and focus rings.
- **Don't** reintroduce `+` corner registration ticks, boxed `.ins-card` subcards, uppercase monospace labels, or `04 EXPORT DISPATCH` headers over the streamlined proof sheet and Export ticket.
- **Don't** link external CDN font stylesheets or icon-font kits; keep `Archivo`, `Bricolage Grotesque`, and `Martian Mono` self-hosted in `src/assets/fonts/` and UI icons as `strokeWidth={1.75}` inline SVGs in `src/components/icons.tsx`.
