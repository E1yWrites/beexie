# 10: Motion spec: silk cover and animation pass

Status: **approved by the user on 2026-11-14 ("Yes, build it").** The silk register is retired by `docs/12-golden-hour-meadow-spec.md` (2026-11-15): the art plates are voxel scenes and move in steps like the rest of the page.

User decisions (2026-11-14):
- Silk rule: "Yes, art plates only". Silk on the cover and back cover art plates; all UI stays flat and stepped.
- Scope: "Everything P1-P3".
- Studio under 1180px: "Keep stacked + fixes". This signs off the as-built section 7 amendment in spec 09.
- Preset names: "Rename to Pocket Mono". The `Game Boy DMG` preset is shown as `Pocket Mono`, and every hardware name is removed from user-facing preset copy. Internal ids (`gameboy-dmg`) stay so tests and saved state keep working.
Builds on `docs/09-redesign-spec.md` (The Instruction Booklet). Branch: `redesign/new-world`.

## 1. Why

The user wants the cover plate to move: a smooth, animated maroon "silk" field like the 21st.dev Silk Blend gradient, in place of the flat red. They also asked for an audit of the current motion and a checklist of opportunities.

## 2. Rule change this asks for

Spec 09 says "flat spot plates only: no gradients, no glows" and "motion is stepped, never eased glides". The silk field breaks both rules on purpose. Proposed translation, so one world still owns the page:

- **Silk is box art, not UI.** It lives only on large art plates: the cover plate, and optionally the back cover. Controls, tabs, panels, and readouts keep flat plates and stepped motion.
- **Two motion registers.** Art plates may glide slowly and continuously. UI changes snap in steps, like sprites. Nothing in between.
- The cover plate color moves from flat red `#d81e28` to a maroon silk. The red plate token stays for tabs, cards, and the image stage.

## 3. Current motion audit (as built)

| # | Where | What | Verdict |
|---|---|---|---|
| 1 | Studio canvas, landing sprites | Ghost-grid scanfill, stepped row reveal, 420 ms | Keep. It is the signature. |
| 2 | Inspector | Panel fade-in, 3 steps, 120 ms | Weak. Barely visible. Replace (C5). |
| 3 | Buttons, tabs | Background/color swap, 2 steps | Keep. |
| 4 | Toggle | Thumb jump, 2 steps | Keep. |
| 5 | Toast | 8 px rise, 2 steps | Keep. |
| 6 | Spinner | 8-step rotation | Keep. |
| 7 | Reduced motion | Everything collapses to instant | Keep. The silk must obey it too. |

Gaps: the cover is static until a control is touched; tab changes have no transition; palette and readout changes just snap; export has no "done" moment; the theme switch is an instant flash.

## 4. Checklist

Priority **P1** is what was asked for; **P2** adds the most for the least; **P3** is optional polish.

### P1: Silk cover
- [x] **C1. Silk plate shader.** A raw WebGL fragment shader (no three.js, no new dependency) behind the cover sprite: slow flowing folds in maroon (base about `#4a0d18`, sheen peaks about `#b3263a`), fine grain noise, speed tuned so a fold crosses the plate in about 8 to 12 s. New file `src/components/ui/SilkPlate.tsx`, about 100 lines.
- [x] **C2. Performance guards.** Device pixel ratio capped at 1.5. Pause when the cover is off screen (IntersectionObserver) or the tab is hidden. Frame cost under 2 ms on an integrated GPU.
- [x] **C3. Fallbacks.** With reduced motion, render one still frame. Without WebGL, use a flat maroon fill. No layout shift either way.
- [x] **C4. Contrast.** The legend text and swatch strip on the plate keep at least 4.5:1 against the brightest sheen. Add the maroon pair to `check-contrast.cjs`. Dark theme uses the same silk.

### P2: Stepped UI moments (inside the booklet grammar)
- [x] **C5. Tab flood.** When a stage tab opens, its plate color wipes in from the page edge in 4 steps (clip-path). Replaces the weak panel fade.
- [x] **C6. Palette cascade.** When the palette changes (cover, Color stage, comb), swatches flip in one by one, about 20 ms apart, stepped.
- [x] **C7. Readout tick.** Grid, output, and color counts roll through their digits in steps instead of jumping, as a sprite counter does. Reuses the existing fixed slots, so nothing reflows.
- [x] **C8. Export stamp.** While encoding, the Download button shows a stepped progress stripe. On success, a short "Saved" stamp prints over the button, then clears.
- [x] **C9. Drop target.** Dashed borders on drop zones march in steps while a file is dragged over them.

### P3: Polish
- [x] **C10. Theme switch.** A View Transitions API wipe between light and dark in 6 steps, top to bottom. Instant where the API is unsupported.
- [x] **C11. Bee mark.** A two-frame wing flap on hover over the wordmark.
- [x] **C12. Preset card hover.** The card's sprite runs a palette rotation, the classic sixteen-color trick, while hovered.
- [x] **C13. Back cover silk.** The same shader in deep blue on the "Your turn." plate, sharing one WebGL helper with C1. In scope.

Explicitly not doing: scroll-reveal entrances on every section, parallax, hover glows, eased slide-ins on UI. The craft floor bans one identical entrance repeated everywhere, and they fight the stepped grammar.

### Finish-review fixes (impeccable reviewer verdict: fix)
These come from the booklet build's finish review and ship in the same pass.
- [x] **F1. Leader lines.** Draw real 1px leader lines from the lettered callouts to the controls they label, in the How to play diagrams and on the cover rails. The contract promised them and the build only has letter badges.
- [x] **F2. True integer scale.** The cover and preset sprites render uneven cells (9/10 px and 3/4 px). Size each canvas box to `floor(available / cells) * cells` so every cell is the same size.
- [x] **F3. Panel 1 peek.** At 1440x900 the first How to play panel must show above the fold, not just its heading.
- [x] **F4. Studio under 1180px.** Wrap the stage bar and export controls onto two rows instead of hidden sideways scrolls. Stop sticking the tabs under 760px. Keep each tab's numeral beside its label. Group Output with Download.
- [x] **F5. Toast on phones.** Make it wider (up to 360px) and keep it clear of the inspector heading.
- [x] **F6. Mobile presets.** Show the preset cards two across under 760px.
- [x] **F7. Preset copy.** Remove real hardware names (SNES, Chrono, CPS-2, NES/Famicom, PC-98, DMG-01) from the preset descriptions, tags, and palette names. Rename `Game Boy DMG` to `Pocket Mono` in the UI, and update the AGENTS.md preset list to match.
- [x] **F8. DESIGN.md.** The impeccable documenter rewrites DESIGN.md, `.impeccable/design.json`, and PRODUCT.md for the new world, including the two motion registers.

## 5. Implementation notes

- Shader approach: a sine and noise "silk" pattern (fabric folds plus a fine grain term) rendered on a full-plate quad. Uniforms: `uTime`, `uColor`, `uSpeed`, `uScale`, `uNoise`, `uRotation`. Written fresh for this project; no copied third-party source.
- The canvas sits behind `.cover-art` inside `.cover-plate` (`position: absolute; inset: 0`), with `aria-hidden`.
- Every new animation goes through the existing `prefers-reduced-motion` block in `base.css`; the shader checks `matchMedia` itself.
- No new runtime dependencies. Bundle growth target: under 2 kB gzip.

## 6. Done criteria

- `npm run typecheck`, `npm test` (70/70), `npm run build`, `npm run check:contrast` pass.
- Cover at 1440, 768, and 390 in both themes: silk moves smoothly, holds 60 fps on desktop, pauses off screen, freezes with reduced motion, and falls back to flat maroon without WebGL.
- impeccable detector clean; the finish review includes a motion check.
- `DESIGN.md` records the two motion registers.
