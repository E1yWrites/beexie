# 05: Implementation Plan

1. **Tokens, Fonts & Contrast:** Update `index.html`, `src/types.ts`, `src/hooks/useTheme.ts`, `src/styles/tokens.css`, `src/styles/base.css`, and `scripts/check-contrast.cjs` for Dual-Theme Spot-Ink Proof Studio.
2. **Mascot & Flowing Background Paths:** Author geometric `<BeeMark />` + `public/favicon.svg`, implement Canvas 2D `Path2D` `BackgroundPaths` (`src/components/ui/background-paths.tsx`), and add pointer-tracking Cobalt Spotlight cards (`useSpotlightCards.ts`).
3. **Landing Surface:** Refactor `LandingNav.tsx`, `LandingHero.tsx`, `LandingFeatures.tsx`, `LandingFaq.tsx`, `LandingFooter.tsx`, `LegalModal.tsx`, and `landing.css` to match `rebrand-safer-riso.jpg` (using `/specimen.jpg`).
4. **Studio Surface:** Refactor `App.tsx`, `AppHeader.tsx`, `ToolRail.tsx`, `Workspace.tsx`, `EmptyBench.tsx`, `ProofFrame.tsx`, `StatusBoard.tsx`, `Inspector.tsx`, `PaletteComb.tsx`, `ExportTicket.tsx`, and `shell.css` / `stage.css` / `inspector.css` / `ticket.css` / `responsive.css` to match `studio-7-slim-rail.png` & `studio-7-slim-rail-dark.png`.
5. **Verification & Handoffs:** Run `npm run typecheck`, `npm test`, `npm run check:contrast`, `npm run build`, `impeccable detect --json`, headless desktop/mobile captures, `impeccable-finish-reviewer`, and `impeccable-documenter` (`DESIGN.md` + `.impeccable/design.json`).
