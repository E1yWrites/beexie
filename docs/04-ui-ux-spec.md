# 04: UI/UX Specification

**Canonical Reference Documents:** See `DESIGN.md` and `.impeccable/design.json` for the complete verified design system specification.  
**Historical Decision Comps:**
- Landing (`Persuade`): `.impeccable/mocks/decision/rebrand-safer-riso.jpg`
- Studio (`Operate`, Light): `.impeccable/mocks/decision/studio-7-slim-rail.png`
- Studio (`Operate`, Dark): `.impeccable/mocks/decision/studio-7-slim-rail-dark.png`

## 1. Visual System: Spot-Ink Proof Studio

- **Light Cotton Ivory:** Paper `#f8f6f1`, sheet `#ffffff`, recessed `#f1eee7`, ink `#111317`, secondary `#3d414a`, muted `#575b64`, boundary `#6b6860`, hairline `#dcd7cc`, cobalt accent `#1e46e8`, vermilion accent `#eb4a2d` (`#c23117` text-safe).
- **Dark Pressroom Charcoal:** Paper `#12141a`, sheet `#191c23`, recessed `#222630`, ink `#f5f6f8`, secondary `#c6cbd6`, muted `#9ea5b5`, boundary `#8c92a0`, hairline `#2d323e`, cobalt accent `#2d55eb` (`#85aaff` text-safe accent), vermilion `#ff5a3c` (`#ff8770` text-safe).
- **Typography:** `Bricolage Grotesque` (unitalicized display headings), `Archivo` (sentence-case UI labels & prose), `Martian Mono` (`tabular-nums` strictly on numbers, dimensions, `01-04` rail indices, and hex codes). Zero external font CDNs.
- **Concentric Geometry:** Mathematical `inner = outer - padding` corners on proof sheets (`14px - 10px = 4px`) and segmented controls (`9px - 3px = 6px`).
- **Brand & Icons:** Geometric ink-stamp SVG `<BeeMark />` (`public/favicon.svg`) and unified `strokeWidth=1.75` inline SVG icon set (`src/components/icons.tsx`), including animated `<SpinnerIcon />` feedback on decode, conversion, and encoding states.

## 2. Layout & Responsive Rules

- **Landing Page:** Sticky `60px` hairline header -> `0.84fr / 1.36fr` asymmetric hero (left headline, prominent Cobalt CTA, secondary dropzone; right `4:3` interactive specimen workbench with `Compare | Pixel art | Original`, `Grid lines`, presets, vermilion dither toggle, 16 swatches) -> framed `--panel` 4-column hairline Pipeline Proof Sheet -> framed `--panel` `0.84fr / 1.36fr` Split FAQ Accordion Sheet -> bottom CTA sheet & focus-trapped legal modal.
- **Studio Workbench:** `54px` header -> `64px` left numbered rail (`01 Intake`, `02 Grid`, `03 Color`, `04 Finish`) -> wide central proof frame with `StageBar` & concise `StatusBoard` -> `360px` spacing-grouped `.panel-group` `Inspector` + dashed-rule `Export` ticket. Stacks cleanly below `1180px`, `760px`, and `480px` with `>= 44px` coarse touch targets across controls, close buttons, and swatch cells.
