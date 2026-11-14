# 01: Product Requirements Document

**Product:** beexie - Spot-Ink Proof Studio (Client-Side Pixel Art Converter)  
**Status:** Approved & Implemented Rebrand Specification  
**Platform:** Web (Browser, 100% Client-Side Canvas 2D)

---

## 1. Executive Summary & Vision

beexie is a 100% browser-native image-to-pixel-art converter built around the **Spot-Ink Proof Studio** design system: Cotton-Press Ivory sheets (`#f8f6f1` / `#ffffff`) paired with Pressroom Charcoal (`#12141a` / `#191c23`), Electric Cobalt actions and pointer-tracking Spotlight Card glows (`#1e46e8` / `#2d55eb` / `rgb(96 139 255)`), scoped Proof Vermilion compare rules and live dither accents (`#eb4a2d` / `#ff5a3c`), and mirrored flowing cubic-Bezier `BackgroundPaths` ribbons (`Path2D`).

It spans two unified surfaces:
1. **Landing Page (Persuade):** Sticky hairline header -> asymmetric `0.84fr / 1.36fr` hero pairing concise unitalicized headline, prominent cobalt `Open Pixel Studio` CTA, and dropzone with an enlarged live 4:3 interactive workbench of `public/specimen.jpg` (`Compare | Pixel art | Original`, `Grid lines`, `16x16` to `96x96`, Floyd-Steinberg dither switch, 16 swatches) -> framed 4-column hairline Pipeline Proof Sheet with aligned stage footer strips -> framed `0.84fr / 1.36fr` Split FAQ Accordion Sheet -> bottom launch sheet and keyboard-trapped legal modal.
2. **Studio Workbench (Operate):** Slim `54px` header (`beexie`, `Overview`, active file, `New project`, theme toggle) -> `64px` `01-04` left stage index rail (`Intake`, `Grid`, `Color`, `Finish`) -> wide central proof canvas (`StageBar`, concentric `ProofFrame` with `inner = outer - padding` corners, `EmptyBench`, concise `StatusBoard`) -> `360px` spacing-grouped right `Inspector` (`.panel-group`) and dashed-rule `Export` ticket.

## 2. Core Design & Technical Invariants

1. **Zero Functionality Regressions:** All Canvas 2D downsampling, Median-Cut quantization, Floyd-Steinberg dithering, custom palettes, zoom/compare math, and PNG/JPG/WEBP exports (`1x-8x` up to `16,384 px`) remain exact; all 52 Vitest unit tests stay green.
2. **Dual-Theme Discipline:** Light Cotton Ivory (`light`, default) and Dark Pressroom Charcoal (`dark`), passing all 18 checks in `npm run check:contrast` at WCAG AA.
3. **Typography & Data Precision:** Self-hosted `Bricolage Grotesque` (display), `Archivo` (UI & prose), and `Martian Mono` (`tabular-nums` strictly on numeric dimensions, counts, `01-04` indices, and hex swatches).
4. **Flowing Background Paths & Spotlight Cards:** Mirrored 72-path cubic-Bezier ribbons (`BackgroundPaths`, Canvas 2D `Path2D`) flow cleanly on Landing, pause to calm architectural linework in Studio, and collapse under `prefers-reduced-motion: reduce`, while top-level proof sheets highlight cleanly with a pure Cobalt pointer-tracking Spotlight glow (`[data-spotlight]`).
5. **Local Memory Privacy:** Zero server uploads, zero cookies, zero external font CDNs.
