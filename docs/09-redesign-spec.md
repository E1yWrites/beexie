# 09: Redesign spec, "The Instruction Booklet"

Status: **approved by the user on 2026-11-14, implemented on `redesign/new-world`.**
Tracking issue: E1yWrites/beexie#12. Branch: `redesign/new-world`.

## 1. Why

The Spot-Ink look reads as templated, is not pixel-native, is too quiet, and the Studio is cramped (canvas, inspector, and export ticket compete for height). Target audience for the landing: game devs and pixel artists.

## 2. Locked direction

Chosen on the impeccable decision page (seed `2524a50e`, assigned direction, code-led build, no comps).

**The Instruction Booklet.** beexie is the booklet from the game box: a cover, numbered "how to play" spreads, labeled diagrams of real controls, sprites printed big at integer scale. Light theme is booklet stock; dark theme is the cartridge shell.

Rules carried into the build:
- Flat spot plates only: no gradients, no glows, no blur, no soft shadows.
- One accent at a time: the stage in use floods its plate color; everything else is ink and paper.
- Square corners, hairline black rules, leader-line callouts.
- Ghost grid: empty cell grids are designed, not blank.
- Readouts sit in fixed slots and never reflow.
- Motion is stepped (CSS `steps()`), never eased glides. `prefers-reduced-motion` makes every change instant.
- No real console names, logos, seals, or trade dress anywhere.

Retired: `BackgroundPaths` canvas, spotlight cards (`useSpotlightCards`, `[data-spotlight]`), Bricolage Grotesque, Archivo, Martian Mono, cobalt and vermilion tokens.

## 3. What does not change

- Every feature in AGENTS.md "Required feature surface", the four stages, touch-up tools, batch zip, retro presets.
- The whole pipeline in `src/lib/`, `useConverter`, `DEFAULT_SETTINGS`, and all 70 tests.
- Light + dark themes with the header toggle and `beexie-theme` persistence.
- The beexie name and bee mark (the mark is redrawn in the new line weight, same geometry).
- Zero runtime dependencies beyond React.

## 4. Tokens (replace `src/styles/tokens.css` and mirror in `scripts/check-contrast.cjs`)

| Role | Light (booklet) | Dark (cartridge shell) |
|---|---|---|
| Ground | `#ffffff` | `#1d1e22` |
| Sheet / well | `#f3f3f5` | `#26272c` |
| Ink | `#16161a` | `#f2f2f4` |
| Muted ink | `#5a5a63` | `#a3a3ad` |
| Rule | `#16161a` hairline | `#f2f2f4` at 24% |
| Red plate (field) | `#d81e28` with white text | same |
| Red text | `#c4121c` | `#ff6b6b` |
| Yellow plate (field) | `#ffc81e` with ink text | `#ffd23f` |
| Blue plate (field, primary action) | `#2449e0` with white text | same |
| Blue text | `#2449e0` | `#7f9cff` |
| Checker | `#ececef` / `#f7f7f9` | `#2a2b30` / `#222327` |

Measured contrast (WCAG): ink on white 18.0, white on red 5.1, ink on yellow 11.6, white on blue 6.8, red text on white 6.1, muted on white 6.8, chalk on shell 14.9, red text on shell 6.0, yellow on shell 11.5, blue text on shell 6.4, muted on shell 6.7. All pass AA; `npm run check:contrast` must pass with the new pairs.

Stage plate mapping: 1 Image = red, 2 Grid = yellow, 3 Color = blue, 4 Finish = ink.

## 5. Type

Self-hosted woff2 subsets (OFL, from Google Fonts) in `src/assets/fonts/`, replacing the current three.
- **Display:** Dela Gothic One. Heavy Japanese-style gothic, the voice of booklet covers.
- **Body and UI:** Zen Kaku Gothic New (400, 700). Clean gothic for reading and controls.
- **Pixel accent:** DotGothic16. Only for stage numerals, sprite captions, and the `8x` style scale tags. Never body text.
- **Numbers:** readouts and numerals use DotGothic16, which is fixed width, so fixed readout slots never reflow.

## 6. Landing (`src/components/landing/*`, `src/styles/landing.css`)

1. **Label band (nav):** bee mark + wordmark, How to play / Presets / FAQ, theme toggle, "Open Studio" button. Thin black rule beneath.
2. **Cover (first viewport):** red plate owns the left ~55% with the koi rendered as a live 48x48 sprite through the real pipeline, integer scaled, breaking the plate edge. Right column on white: headline, two-line pitch, black "Open Studio" button, drop target ("Drop an image on the cover"). Dropping an image converts it on the cover in place, then "Open in Studio" carries it over. Grid presets (16 / 32 / 48 / 96) and a dither switch sit as labeled callouts on the sprite's rim. Panel 1 of the next spread peeks at the bottom.
3. **How to play (4 panels):** one panel per stage, each a diagram of the real control with numbered leader-line callouts. Replaces `LandingFeatures`.
4. **Presets spread:** the five retro presets (`16-Bit JRPG`, `Arcade Action`, `8-Bit Classic`, `Game Boy DMG`, `Cyberpunk 1993`) as cartridge-label cards, each showing the specimen processed live with that preset. No sample images baked in.
5. **"Stays in your browser" page:** the privacy truth set like the booklet's safety page: short, numbered, factual.
6. **FAQ:** booklet Q and A layout, same questions, copy tightened.
7. **Back cover:** closing CTA, colophon links, legal modal (restyled, same content and focus trap).

Signature interaction: **ghost grid fill.** The cover sprite starts as a designed ghost grid; when processing finishes, cells fill in scanline order over ~400 ms using stepped timing. Same on preset cards as they scroll into view. Reduced motion: instant.

## 7. Studio (`src/components/workspace/*`, `shell/*`, `inspector/*`, styles)

Layout fixes the cramped complaint by giving export its own row:

```
+--------------------------------------------------------------+
| label band: bee  file.png              New project   theme   |
+----+------------------------------------------+--------------+
| 1  | view: Original Pixel Compare   zoom      |              |
| 2  |                                          |  stage       |
| 3  |              canvas (ghost grid          |  inspector   |
| 4  |              when empty)                 |  ~400px      |
|    | readouts: grid  output  colors  status   |  full height |
+----+------------------------------------------+--------------+
| export bar: format  scale  size  quality  bg     [Download]  |
+--------------------------------------------------------------+
```

- **Thumb-index tabs** replace the `01-04` rail: numerals in the pixel face, the active tab floods its stage plate color.
- **Inspector** only holds the active stage; `ExportTicket` moves out of it into the **export bar**. `lib/ticket.ts` still drives disabled reasons, shown inline next to Download.
- **Canvas:** ghost grid at the current grid size when empty; same ghost grid fill on reprocess. Checkerboard behind transparency stays.
- **Readouts** in fixed slots on the canvas bottom rim (replaces `StatusBoard` styling, same data).
- **Responsive (as built):** under 1180px the booklet stacks: tabs become a sticky strip under the header, the canvas keeps a fixed height, the inspector follows below it, and the export bar stays sticky at the bottom. Under 760px the export controls scroll sideways while Output and Download stay in place. This replaced the drawer and bottom-sheet idea: it keeps every control reachable without extra open and close states.

## 8. Out of scope

New features from the issue backlog, copy changes beyond tightening, any pipeline change.

## 9. Done criteria

- `npm run typecheck`, `npm test` (70/70), `npm run build`, `npm run check:contrast` pass; CI green on the PR.
- `impeccable detect` on changed targets returns no findings.
- Browser check, both themes, at 1440, 768, 375: full flow (upload PNG, JPG, WEBP; change grid; color modes; dither; preset; touch-up; compare; export each format) downloads real files.
- impeccable finish review verdict recorded; `DESIGN.md`, `PRODUCT.md`, `.impeccable/design.json`, AGENTS.md "Repo state", and README updated to the new world.
- No em-dashes; brand is "beexie" everywhere.
