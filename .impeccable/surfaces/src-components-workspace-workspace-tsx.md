---
version: 1
slug: "src-components-workspace-workspace-tsx"
primary_target: "src/components/workspace/Workspace.tsx"
related_targets: ["src/components/shell/AppHeader.tsx","src/components/shell/ToolRail.tsx","src/components/inspector/Inspector.tsx","src/components/inspector/ExportTicket.tsx","src/styles/shell.css","src/styles/inspector.css"]
---

# Surface Brief: beexie Studio

- **Scope:** `src/components/workspace/Workspace.tsx` (`AppHeader.tsx`, `ToolRail.tsx`, `StageBar.tsx`, `ProofFrame.tsx`, `StatusBoard.tsx`, `EmptyBench.tsx`, `Inspector.tsx`, inspector panels, `ExportTicket.tsx`)
- **Mode:** Operate
- **Task:** upload, set grid, set color, touch up, export. Frequent, hands on controls, eyes on the image. Complaint to fix: the bench, inspector, and export ticket compete for space.
- **Keep:** the four stages and every control, single source of truth in `useConverter`, light + dark themes.

## Direction contract

- **THESIS:** The Studio is the booklet opened flat on the desk: the image is the page, the controls are its labeled diagram. It refuses the stacked sidebar where export fights settings for height.
- **OWN-WORLD:** Same booklet world, Restrained strategy: white stock and black ink, with each stage's plate color appearing only on the stage in use. Thumb-index tabs on the left edge, numbered in the pixel face. Ghost cell grid behind the empty canvas. Flat fills, hairline black rules, square corners.
- **STORY:** The creator drops an image, watches the ghost grid fill, steps through tabs 1 to 4 with the active tab flooding its plate color, compares in place, and exports from a bar that is always visible and never squeezes the settings.
- **FIRST VIEWPORT:** Top label band (bee mark, file name, New project, theme). Left: four thumb-index tabs. Center: canvas with view mode and zoom on its top rim and readouts in fixed slots on its bottom rim. Right: one stage inspector at full height, wider than today. Bottom: a full-width export bar (format, scale, size, quality, Download) that collapses to a sheet on mobile.
- **FORM:** The Instruction Booklet world (seed key `2524a50e`), Studio built code-led under it.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
