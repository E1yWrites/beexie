# 03: Technical Specification

**Product:** beexie - Spot-Ink Proof Studio  
**Stack:** React 19, TypeScript, Vite, Canvas 2D, Vitest

## 1. Architecture

- `src/types.ts`: `Theme = 'light' | 'dark'` (legacy `'voxel'` migrated to `'light'`).
- `src/hooks/useTheme.ts`: Defaults to `'light'` (`#f8f6f1`), toggles `'light' <-> 'dark'`, syncs `data-theme`, `colorScheme`, `<meta name="theme-color">`, and `localStorage['beexie-theme']`.
- `src/components/ui/background-paths.tsx`: `BackgroundPaths` renders dual mirrored arrays of 36 sweeping cubic-Bezier `Path2D` ribbons onto a HiDPI 2D canvas, adapting stroke color (`--path-ink`) cleanly between Light Ivory and Dark Pressroom themes while pausing gently when `paused` (Studio) or `prefers-reduced-motion: reduce`.
- `src/hooks/useSpotlightCards.ts` & `[data-spotlight]`: Single rAF-coalesced `pointermove` tracker updating `--spot-x`, `--spot-y`, and `--spot-active` on proof sheets and drop benches for a pure Electric Cobalt (`--accent-rgb`) radial border & surface glow without `mask-composite` or external dependencies.
- `src/lib/*`: Untouched deterministic conversion math (`pixelate.ts`, `colors.ts`, `palette.ts`, `dimensions.ts`, `export.ts`, `compare.ts`, `stages.ts`, `ticket.ts`, `validation.ts`, `image.ts`, `format.ts`).

## 2. Verification Gates

- `npm run typecheck` (`tsc -b --noEmit`)
- `npm test` (52/52 Vitest tests)
- `npm run check:contrast` (WCAG AA verification across Light Ivory & Dark Pressroom)
- `npm run build` (`tsc -b && vite build`)
- `impeccable detect --json` on changed UI targets
