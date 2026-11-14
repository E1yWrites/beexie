---
version: 1
slug: "src-components-workspace-workspace-tsx"
primary_target: "src/components/workspace/Workspace.tsx"
related_targets: ["src/components/shell/AppHeader.tsx","src/components/shell/ToolRail.tsx","src/components/inspector/Inspector.tsx","src/components/inspector/ExportTicket.tsx","src/styles/shell.css","src/styles/inspector.css"]
---

# Surface Brief — Beexie Studio Workbench

- **Scope:** `src/components/workspace/Workspace.tsx` (`AppHeader.tsx`, `ToolRail.tsx`, `StageBar.tsx`, `ProofFrame.tsx`, `StatusBoard.tsx`, `Inspector.tsx`, `ExportTicket.tsx`)
- **Mode:** Operate

## Direction contract

- **THESIS:** Replaces the wide 236px left sidebar and emerald/voxel surface styling with a 64px numbered Spot-Ink stage rail (`01 Intake`, `02 Grid`, `03 Color`, `04 Finish`), maximizing central canvas workspace and unifying Light Ivory + Dark Pressroom themes over a gentle animated halftone WebGL backdrop.
- **OWN-WORLD:** Dual-theme Spot-Ink Proof Studio: Cotton-Press Ivory (`#f8f6f1` ground, `#ffffff` sheet, `#15171c` ink) in Light mode and Pressroom Charcoal (`#12141a` ground, `#191c23` sheet, `#f3f4f6` ink) in Dark mode, with Electric Cobalt (`#1e46e8` light / `#4d73ff` dark) active selection & download actions, Vermilion (`#eb4a2d`) compare handle & alert badges, `+` registration ticks, Archivo sans UI + Martian Mono tabular telemetry, and geometric ink-stamp `beexie` bee emblem.
- **STORY:** The creator opens or drops an image onto the bench, tracks progress effortlessly along the 64px `01–04` edge strip, adjusts grid/palette/finish in focused single-stage panels while comparing `Original` / `Pixel art` / `Compare` live on the central proof sheet, and exports exact pixel files from the pinned `04 Export Dispatch` ticket.
- **FIRST VIEWPORT:** Slim 54px top header (`beexie` geometric bee + `STUDIO`, `<- Overview`, specimen pill, `100% LOCAL MEMORY`, `New Project`, Light/Dark toggle) above a three-band bench: 64px left numbered edge rail (`01`–`04` with active cobalt indicator), expansive central proof canvas with top-row `Original | Pixel art | Compare` + `Fit / - / 100% / +` controls, registration-ticked canvas frame over alpha checkerboard, and bottom status telemetry (`Ready · GRID · OUT · SWATCHES · LOCAL 100%`), paired with a compact 364px right inspector + dashed-rule pinned Export Dispatch ticket.
- **FORM:** Candidate 7 (`studio-7`, Slim Edge Index & Dual-Theme Proof Bench), dealt index 7 in `surface` / `operate` roll (seed key `320ce7c5`), anchored on `.impeccable/mocks/decision/studio-7-slim-rail.png`.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
