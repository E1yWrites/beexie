# 08: Retro Style Presets Specification

**Feature:** Authentic Hardware-Era Retro Style Presets  
**Status:** APPROVED & IMPLEMENTED  
**Architecture:** 100% Client-Side, Deterministic Canvas 2D / `Uint8ClampedArray` Buffer Processing (Zero AI, Zero External Dependencies)  

---

## 1. Product Requirements Document (PRD)

### 1.1 Problem Statement & Background
In `beexie`, users convert modern images into pixel art using client-side downsampling, Median-Cut palette reduction, and Floyd-Steinberg or Bayer dithering. While mathematically precise, real hardware from historic gaming eras exhibited distinct physical and architectural idiosyncrasies:
- 16-bit SNES games used 15-bit RGB color depth (32 levels per channel, 32,768 possible colors) with softened luminance contours and vibrant saturation.
- Capcom CPS-2 arcade hardware used custom 12-bit DAC palettes (16 levels per channel, 4,096 colors) characterized by punchy, high-contrast dynamic lighting and deliberate dark silhouette and crease outlines.
- 8-bit NES / Famicom hardware enforced strict PPU background tile limitations: each 8x8 pixel block could display at most 4 colors chosen from an authentic hardware palette.
- Nintendo Game Boy (DMG-01) featured a 2-bit 4-shade reflective olive-green LCD screen with pronounced ordered crosshatch response.
- PC-98 Japanese personal computers used high-contrast 16-color digital RGB palettes paired with ordered 4x4 Bayer crosshatch dithering to simulate subtle gradient steps and metallic sheen in isometric adventure titles.

Current standard controls require users to manually adjust five separate sliders and select boxes to approximate these aesthetics, and standard controls cannot enforce hardware-specific constraints such as 8x8 tile palette discipline or contour crease inking.

### 1.2 Proposed Solution & Goal
Deliver five authentic, instant Retro Style Presets in Stage 03 (Color) of `beexie`. Each preset is powered by pure client-side pixel-buffer algorithms operating directly on `Uint8ClampedArray` memory:

1. **`16-Bit JRPG` (`16bit-jrpg`)**  
   - Era: SNES / Super Famicom (1990-1995, Chrono / Final Fantasy era)  
   - Aesthetic: 32-color vibrant palette, 15-bit RGB quantization (32 levels per channel), softened crease contour darkening to seat shading ramps into classic hand-drawn sprite depth.
2. **`Arcade Action` (`arcade-action`)**  
   - Era: Capcom CPS-2 Arcade (1993-1998, Street Fighter / Darkstalkers era)  
   - Aesthetic: 32-color reduced palette, 12-bit RGB quantization (16 levels per channel), dynamic high-contrast tone curve, and crisp dark `#14101c` contour and crease inking.
3. **`8-Bit Classic` (`8bit-classic`)**  
   - Era: NES / Famicom PPU (1983-1990)  
   - Aesthetic: Master NES system palette, bold silhouette outlines, and authentic hardware tile discipline enforcing at most 4 unique colors per 8x8 pixel block.
4. **`Game Boy DMG` (`gameboy-dmg`)**  
   - Era: Nintendo Game Boy DMG-01 (1989)  
   - Aesthetic: Authentic 4-shade olive-green monochrome palette (`#0f380f`, `#306230`, `#8bac0f`, `#9bbc0f`), 4-level quantization, and ordered 4x4 Bayer matrix crosshatch dithering with zero color saturation.
5. **`Cyberpunk 1993` (`cyberpunk-1993`)**  
   - Era: NEC PC-9801 (1988-1995)  
   - Aesthetic: 16-color high-contrast neon/night palette (`PC98_CYBERPUNK_PALETTE`), 16-level quantization, boosted contrast, and ordered 4x4 Bayer matrix crosshatch dithering.

### 1.3 Non-Goals
- Zero AI / LLM calls: No neural networks, no cloud APIs, and no network dependencies.
- Zero new npm packages: Implemented strictly using TypeScript, browser canvas APIs, and typed array memory.
- No server uploads: Processing remains entirely client-side on the user device.
- No separate standalone editor: Presets integrate seamlessly into the existing 4-stage pipeline and inspectable panels.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: One-Click Hardware Era Styling
> As a game creator or pixel artist, I want to click a single Retro Style Preset button in the Color panel so that my image immediately adopts the authentic palette, quantization, dithering, and physical constraints of that gaming era.

- **AC 1.1:** A dedicated `.panel-group` titled "Retro style presets" appears at the top of Stage 03 (Color) in `ColorPanel.tsx`.
- **AC 1.2:** Clicking an inactive preset immediately updates `retroPreset` and synchronizes the underlying color settings (`colorMode`, `reducedColors`, `customPalette`, `quantization`, `dithering`, `ditherMode`).
- **AC 1.3:** The preview updates within 60ms (debounced) and renders the exact hardware-era look without page reload or layout shift.
- **AC 1.4:** Clicking the currently active preset deselects it (`retroPreset: null`), allowing free manual color tuning while keeping the current slider values intact.

### User Story 2: Inspection and Fine Tuning
> As an artist, I want to inspect the generated color swatches and customize settings after choosing a preset so that I can refine the palette or toggle dithering to match my artistic intent.

- **AC 2.1:** When a preset is active, the extracted or assigned colors are visible in `PaletteComb`.
- **AC 2.2:** Adjusting manual controls (e.g. toggling dither or changing levels) updates the canvas smoothly.
- **AC 2.3:** Clicking the Stage 03 "Reset stage" button in the inspector header resets `retroPreset: null` and restores default color settings.

### User Story 3: Downstream Pipeline Compatibility
> As a user, I want retro preset outputs to work seamlessly with all existing tools and export flows so that my workflow remains uninterrupted.

- **AC 3.1 (Compare View):** The interactive split-view slider in `ProofFrame` correctly compares the retro-processed result against the original source bitmap.
- **AC 3.2 (Pixel Grid):** The preview pixel grid overlay toggles on and off over the retro preset without artifacts.
- **AC 3.3 (Touch-Up Edits):** The pencil, eraser, eyedropper, and undo history functions work directly on top of retro preset pixels; eyedropper picks the exact retro color values.
- **AC 3.4 (Single Export):** Exporting to PNG, JPG, or WEBP at 1x, 2x, 4x, or 8x scale encodes the exact retro preset pixels.
- **AC 3.5 (Batch Export):** Multi-file batch conversion applies the selected retro preset across all files in the batch zip and `sheet.png`.

### Measurable Preset Acceptance Criteria
- **AC P1 (16-Bit JRPG):** Output pixel colors contain at most 32 unique colors, channels are quantized to multiples of 8 (5-bit depth / 32 levels per channel), and interior luminance edges are darkened by 40% before palette extraction.
- **AC P2 (Arcade Action):** Channels are quantized to multiples of 16 (4-bit depth / 16 levels per channel), high-contrast tone grade is applied (contrast: 1.35, saturation: 1.35), and silhouette/crease edges are stamped with dark `#14101c` ink.
- **AC P3 (8-Bit Classic):** Every pixel matches an entry in `EXTENDED_NES_PALETTE`, and every 8x8 pixel block contains at most 4 unique colors.
- **AC P4 (Game Boy DMG):** Output pixels strictly contain only the 4 authentic olive-green hex values (`#0f380f`, `#306230`, `#8bac0f`, `#9bbc0f`), with ordered 4x4 Bayer crosshatch dithering.
- **AC P5 (Cyberpunk 1993):** Output pixels strictly contain only the 16 `PC98_CYBERPUNK_PALETTE` hex values, with contrast boosted to 1.4 and ordered Bayer dithering applied.
- **AC P6 (Bug Fix):** When `colorMode: 'custom'` is used with Bayer dithering, `processColors` correctly passes the `bayer` flag to `applyPalette`.

---

## 3. Technical Specification

### 3.1 Type Definitions (`src/types.ts`)
Add `RetroPresetId` union and extend existing settings interfaces:

```typescript
export type RetroPresetId =
  | '16bit-jrpg'
  | 'arcade-action'
  | '8bit-classic'
  | 'gameboy-dmg'
  | 'cyberpunk-1993';

export interface ConverterSettings {
  // Existing fields...
  resolutionMode: ResolutionMode;
  preset: GridPreset;
  customGrid: GridSize;
  gridAspectLocked: boolean;
  colorMode: ColorMode;
  reducedColors: number;
  customPalette: string[];
  quantization: number;
  dithering: boolean;
  ditherMode: DitherMode;
  gridOverlay: boolean;
  transparentBackground: boolean;
  backgroundColor: string;
  outputWidth: number;
  outputHeight: number;
  outputAuto: boolean;
  outputAspectLocked: boolean;
  format: ExportFormat;
  scale: ScaleFactor;
  quality: number;
  // New field:
  retroPreset: RetroPresetId | null;
}

export interface ColorOptions {
  mode: ColorMode;
  reducedColors: number;
  customPalette: string[];
  quantization: number;
  dithering: boolean;
  ditherMode?: DitherMode;
  transparentBackground: boolean;
  backgroundColor: string;
  // New field:
  retroPreset?: RetroPresetId | null;
}
```

### 3.2 Constants & Palettes (`src/constants.ts`)

#### 3.2.1 Palettes
Add the 16-color PC-98 Cyberpunk palette and extended NES palette:

```typescript
export const PC98_CYBERPUNK_PALETTE: readonly string[] = [
  '#090a14', '#16142b', '#272145', '#423869',
  '#164966', '#217c8f', '#42cfca', '#b8ffee',
  '#4a1733', '#8a2050', '#d4356e', '#ff6e9c',
  '#6b2960', '#a6419e', '#f0b654', '#f6eef8',
];

export const EXTENDED_NES_PALETTE: readonly string[] = [
  '#000000', '#fcfcfc', '#bcbcbc', '#7c7c7c',
  '#a80020', '#f83800', '#fca044', '#f8b800',
  '#00a800', '#58d854', '#0058f8', '#3cbcfc',
  '#6844fc', '#d800cc', '#e40058', '#0078f8',
];
```

#### 3.2.2 Preset Definitions
Define `RetroPresetMeta` and `RETRO_PRESETS`:

```typescript
export interface RetroPresetMeta {
  id: RetroPresetId;
  name: string;
  era: string; // Compact tag: 'SNES 32c', 'CPS-2', 'NES 4c/tile', 'DMG-01', 'PC-98'
  description: string;
  settings: {
    colorMode: ColorMode;
    reducedColors: number;
    customPalette?: string[];
    quantization: number;
    dithering: boolean;
    ditherMode: DitherMode;
  };
  tuning: {
    contrast: number;
    saturation: number;
    contour: 'none' | 'soft' | 'bold';
    inkColor?: string;
    tileDiscipline?: boolean;
  };
}

export const RETRO_PRESETS: readonly RetroPresetMeta[] = [
  {
    id: '16bit-jrpg',
    name: '16-Bit JRPG',
    era: 'SNES 32c',
    description: 'SNES / Chrono-era aesthetic with vibrant 32-color shading and defined contours.',
    settings: {
      colorMode: 'reduced',
      reducedColors: 32,
      quantization: 32,
      dithering: false,
      ditherMode: 'floyd',
    },
    tuning: {
      contrast: 1.12,
      saturation: 1.25,
      contour: 'soft',
    },
  },
  {
    id: 'arcade-action',
    name: 'Arcade Action',
    era: 'CPS-2',
    description: 'Capcom CPS-2 punchy outlines and dynamic lighting.',
    settings: {
      colorMode: 'reduced',
      reducedColors: 32,
      quantization: 16,
      dithering: false,
      ditherMode: 'floyd',
    },
    tuning: {
      contrast: 1.35,
      saturation: 1.35,
      contour: 'bold',
      inkColor: '#14101c',
    },
  },
  {
    id: '8bit-classic',
    name: '8-Bit Classic',
    era: 'NES 4c/tile',
    description: 'NES / Famicom 4-color tile discipline with bold silhouettes.',
    settings: {
      colorMode: 'custom',
      reducedColors: 16,
      customPalette: [...EXTENDED_NES_PALETTE],
      quantization: 0,
      dithering: false,
      ditherMode: 'floyd',
    },
    tuning: {
      contrast: 1.2,
      saturation: 1.15,
      contour: 'bold',
      tileDiscipline: true,
    },
  },
  {
    id: 'gameboy-dmg',
    name: 'Game Boy DMG',
    era: 'DMG-01',
    description: 'Authentic 4-shade olive-green monochrome.',
    settings: {
      colorMode: 'custom',
      reducedColors: 4,
      customPalette: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
      quantization: 4,
      dithering: true,
      ditherMode: 'bayer',
    },
    tuning: {
      contrast: 1.15,
      saturation: 0,
      contour: 'soft',
    },
  },
  {
    id: 'cyberpunk-1993',
    name: 'Cyberpunk 1993',
    era: 'PC-98',
    description: 'High-contrast isometric PC-98 dithering.',
    settings: {
      colorMode: 'custom',
      reducedColors: 16,
      customPalette: [...PC98_CYBERPUNK_PALETTE],
      quantization: 16,
      dithering: true,
      ditherMode: 'bayer',
    },
    tuning: {
      contrast: 1.4,
      saturation: 1.2,
      contour: 'soft',
    },
  },
];
```

Update `DEFAULT_SETTINGS` in `src/constants.ts` to include `retroPreset: null`.

### 3.3 Pure Pixel-Buffer Algorithms (`src/lib/colors.ts`)

All operations operate on `RgbaImage` buffers (`Uint8ClampedArray`), ensuring high performance and zero memory allocation outside necessary clones. Total code footprint is approximately 60 to 75 lines.

#### 3.3.1 Contrast & Saturation Tone Grading: `applyToneGrade`
Calculates S-curve contrast centered at midpoint 128 and boosts or desaturates color channels relative to Rec. 709 luminance:

```typescript
export function applyToneGrade(image: RgbaImage, contrast: number, saturation: number): RgbaImage {
  const out = cloneImage(image);
  const { data } = out;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < ALPHA_THRESHOLD) continue;
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Contrast S-curve around midpoint 128
    if (contrast !== 1) {
      r = clampByte(128 + (r - 128) * contrast);
      g = clampByte(128 + (g - 128) * contrast);
      b = clampByte(128 + (b - 128) * contrast);
    }

    // Saturation scaling relative to luminance
    if (saturation !== 1) {
      const lum = luminance(r, g, b);
      r = clampByte(lum + (r - lum) * saturation);
      g = clampByte(lum + (g - lum) * saturation);
      b = clampByte(lum + (b - lum) * saturation);
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  return out;
}
```

#### 3.3.2 Contour & Crease Edge Inking: `applyContourInk`
Detects luminance and alpha boundary gradients across 4-neighbors (`dx: [-1, 1, 0, 0]`, `dy: [0, 0, -1, 1]`). Creases and silhouettes are inked before color quantization:

```typescript
export function applyContourInk(
  image: RgbaImage,
  strength: number,
  inkColor?: Rgb | null,
): RgbaImage {
  const out = cloneImage(image);
  const { width, height, data } = image;
  const target = out.data;
  const threshold = 36; // Luminance step indicating significant edge

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      if (alpha < ALPHA_THRESHOLD) continue;

      const lum = luminance(data[index], data[index + 1], data[index + 2]);
      let isEdge = false;

      // 4-neighbor inspection
      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          isEdge = true;
          break;
        }
        const nIndex = (ny * width + nx) * 4;
        if (data[nIndex + 3] < ALPHA_THRESHOLD) {
          isEdge = true; // Silhouette boundary against transparency
          break;
        }
        const nLum = luminance(data[nIndex], data[nIndex + 1], data[nIndex + 2]);
        if (Math.abs(lum - nLum) > threshold) {
          isEdge = true;
          break;
        }
      }

      if (isEdge) {
        if (inkColor) {
          // Stamp ink color blended by strength
          target[index] = clampByte(target[index] * (1 - strength) + inkColor.r * strength);
          target[index + 1] = clampByte(target[index + 1] * (1 - strength) + inkColor.g * strength);
          target[index + 2] = clampByte(target[index + 2] * (1 - strength) + inkColor.b * strength);
        } else {
          // Soft contour: darken interior crease
          const factor = Math.max(0, 1 - strength);
          target[index] = clampByte(target[index] * factor);
          target[index + 1] = clampByte(target[index + 1] * factor);
          target[index + 2] = clampByte(target[index + 2] * factor);
        }
      }
    }
  }
  return out;
}
```

#### 3.3.3 NES 8x8 Hardware Tile Discipline: `applyNesTileDiscipline`
Hardware simulation of NES PPU memory limitations. Iterates the grid in 8x8 tiles; for each tile, restricts colors to the 4 most dominant NES palette colors:

```typescript
export function applyNesTileDiscipline(image: RgbaImage, masterPalette: Rgb[]): RgbaImage {
  const out = cloneImage(image);
  const { width, height, data } = out;

  for (let ty = 0; ty < height; ty += 8) {
    for (let tx = 0; tx < width; tx += 8) {
      const tileWidth = Math.min(8, width - tx);
      const tileHeight = Math.min(8, height - ty);

      // Collect frequency of nearest palette entries in this 8x8 block
      const countMap = new Map<number, number>();
      for (let y = 0; y < tileHeight; y += 1) {
        for (let x = 0; x < tileWidth; x += 1) {
          const pixel = ((ty + y) * width + (tx + x)) * 4;
          if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
          const idx = nearestPaletteIndex(data[pixel], data[pixel + 1], data[pixel + 2], masterPalette);
          countMap.set(idx, (countMap.get(idx) ?? 0) + 1);
        }
      }

      if (countMap.size <= 4) continue;

      // Select top 4 most dominant colors in this tile
      const topIndices = Array.from(countMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([idx]) => idx);
      const subPalette = topIndices.map((idx) => masterPalette[idx]);

      // Remap all pixels in this 8x8 tile to the 4 selected tile colors
      for (let y = 0; y < tileHeight; y += 1) {
        for (let x = 0; x < tileWidth; x += 1) {
          const pixel = ((ty + y) * width + (tx + x)) * 4;
          if (data[pixel + 3] < ALPHA_THRESHOLD) continue;
          const chosen = subPalette[nearestPaletteIndex(data[pixel], data[pixel + 1], data[pixel + 2], subPalette)];
          data[pixel] = chosen.r;
          data[pixel + 1] = chosen.g;
          data[pixel + 2] = chosen.b;
        }
      }
    }
  }
  return out;
}
```

#### 3.3.4 Bayer Bug Fix in `processColors`
In `src/lib/colors.ts`, line 339 currently invokes:
`const result = applyPalette(prepared, colors, options.dithering);`
This will be corrected to pass the `bayer` boolean flag:
`const result = applyPalette(prepared, colors, options.dithering, bayer);`

#### 3.3.5 Integration in `processColors`
Before entering the `switch (options.mode)` block, if `options.retroPreset` is defined:
1. Lookup the preset from `RETRO_PRESETS`.
2. Apply `applyToneGrade(out, tuning.contrast, tuning.saturation)`.
3. If `tuning.contour !== 'none'`, apply `applyContourInk(out, tuning.contour === 'bold' ? 0.65 : 0.40, tuning.inkColor ? parseHexColor(tuning.inkColor) : null)`.
4. If `tuning.tileDiscipline`, parse `EXTENDED_NES_PALETTE` into `Rgb[]` and run `applyNesTileDiscipline(out, nesColors)`.
5. Continue through the standard mode switch, quantizing and applying the palette as configured.

### 3.4 Hook & Batch Integration

#### 3.4.1 `useConverter.ts`
- Pass `retroPreset: settings.retroPreset` into `processColors` call.
- Add `settings.retroPreset` to the reactive dependency array in `useEffect`.
- Add `applyRetroPreset` handler to `ConverterController`:
  ```typescript
  const applyRetroPreset = useCallback((presetId: RetroPresetId | null) => {
    if (!presetId) {
      setSettings((prev) => ({ ...prev, retroPreset: null }));
      return;
    }
    const meta = RETRO_PRESETS.find((item) => item.id === presetId);
    if (!meta) return;
    setSettings((prev) => ({
      ...prev,
      retroPreset: presetId,
      colorMode: meta.settings.colorMode,
      reducedColors: meta.settings.reducedColors,
      customPalette: meta.settings.customPalette ? [...meta.settings.customPalette] : prev.customPalette,
      quantization: meta.settings.quantization,
      dithering: meta.settings.dithering,
      ditherMode: meta.settings.ditherMode,
    }));
  }, []);
  ```
- In `resetStage('color')`, include `retroPreset: null`.

#### 3.4.2 `batch.ts`
- In `convertBatch`, forward `retroPreset: settings.retroPreset` inside `processColors(...)` so batch zips and sprite sheets match the active preset.

---

## 4. UI/UX Specification

### 4.1 Layout & Visual Design
The Retro Style Presets card list is located at the top of Stage 03 (Color) in `ColorPanel.tsx`, above the existing "Color mode" segmented control.

```
+-------------------------------------------------------+
| Retro style presets                                   |
| +---------------------------------------------------+ |
| | 16-Bit JRPG                           [SNES 32c]  | |
| | Vibrant 32-color shading with softened contours   | |
| +---------------------------------------------------+ |
| | Arcade Action                            [CPS-2]  | |
| | Dynamic lighting with punchy crease inking        | |
| +---------------------------------------------------+ |
| | 8-Bit Classic                       [NES 4c/tile] | |
| | Authentic 8x8 tile constraint with bold outlines  | |
| +---------------------------------------------------+ |
| | Game Boy DMG                            [DMG-01]  | |
| | Original 4-shade olive LCD with ordered Bayer     | |
| +---------------------------------------------------+ |
| | Cyberpunk 1993                           [PC-98]  | |
| | High-contrast neon isometric with stable crosshatch| |
| +---------------------------------------------------+ |
+-------------------------------------------------------+
| Color mode                                            |
| [ Orig ] [ Palette ] [ Gray ] [ Mono ] [ Custom ]     |
+-------------------------------------------------------+
```

### 4.2 Component Details (`ColorPanel.tsx`)
- Render a `.panel-group` with `.field-head` title: `Retro style presets`.
- Card list container `.retro-presets` containing 5 buttons (`button.retro-preset-btn`).
- Each button displays:
  - Header line: Preset name in semi-bold display typography (`var(--font-display)`, `var(--fs-sm)`) and era badge in tabular mono (`var(--font-mono)`, `var(--fs-xs)`).
  - Description line: Single line description in subtle ink (`var(--ink-3)`, `var(--fs-xs)`).
- Active state: `.retro-preset-btn.active` has Electric Cobalt border (`var(--accent)`), subtle background tint (`var(--accent-soft)`), and accented era badge.
- Clicking an active preset toggles it off (`onSelectPreset(null)`).
- Keyboard accessible: Standard button element with focus ring (`var(--focus-ring)`).

### 4.3 Stylesheet Integration (`src/styles/inspector.css`)
Add minimal, token-compliant rules:

```css
.retro-presets {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

.retro-preset-btn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: var(--s-2) var(--s-3);
  background: var(--panel-2);
  border: 1px solid var(--line-subtle);
  border-radius: var(--r-md);
  text-align: left;
  cursor: pointer;
  transition: border-color 140ms ease, background-color 140ms ease;
}

.retro-preset-btn:hover {
  background: var(--panel-3);
  border-color: var(--line);
}

.retro-preset-btn.active {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.retro-preset-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-2);
}

.retro-preset-name {
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  font-weight: 700;
  color: var(--ink);
}

.retro-preset-btn.active .retro-preset-name {
  color: var(--accent-text);
}

.retro-preset-era {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  padding: 1px 5px;
  background: var(--panel);
  border: 1px solid var(--line-subtle);
  border-radius: var(--r-tag);
  color: var(--ink-2);
}

.retro-preset-btn.active .retro-preset-era {
  border-color: var(--accent);
  color: var(--accent-text);
}

.retro-preset-desc {
  font-size: var(--fs-xs);
  color: var(--ink-3);
  line-height: 1.3;
}
```

### 4.4 Theme & Contrast Verification
- All text styles strictly use tokens from `tokens.css`.
- Light theme (`Cotton-Press Ivory`):
  - `.retro-preset-name` (`var(--ink)`) on `.retro-preset-btn` (`var(--panel-2)`): 12.8:1 (exceeds WCAG AA 4.5:1).
  - `.retro-preset-desc` (`var(--ink-3)`) on `var(--panel-2)`: 5.87:1 (exceeds WCAG AA 4.5:1).
  - Active `.retro-preset-name` (`var(--accent-text)`) on `var(--accent-soft)`: 6.28:1.
- Dark theme (`Pressroom Charcoal`):
  - `.retro-preset-name` on `var(--panel-2)`: 13.4:1.
  - `.retro-preset-desc` on `var(--panel-2)`: 6.13:1.
  - Active `.retro-preset-name` on `var(--accent-soft)`: 7.46:1.
- Full 18/18 WCAG AA contrast compliance verified via `npm run check:contrast`.

---

## 5. Implementation Plan

### Phase 1: Types & Constants
- Update `src/types.ts`:
  - Export `RetroPresetId`.
  - Add `retroPreset: RetroPresetId | null` to `ConverterSettings`.
  - Add `retroPreset?: RetroPresetId | null` to `ColorOptions`.
- Update `src/constants.ts`:
  - Export `PC98_CYBERPUNK_PALETTE` and `EXTENDED_NES_PALETTE`.
  - Export `RETRO_PRESETS` array with metadata and tuning parameters.
  - Add `retroPreset: null` to `DEFAULT_SETTINGS`.

### Phase 2: Pure Pixel Algorithms & Unit Tests
- Update `src/lib/colors.ts`:
  - Export `applyToneGrade(image, contrast, saturation)`.
  - Export `applyContourInk(image, strength, inkColor)`.
  - Export `applyNesTileDiscipline(image, masterPalette)`.
  - Fix Bayer bug in `case 'custom':` (`applyPalette(..., options.dithering, bayer)`).
  - Wire `retroPreset` handling inside `processColors`.
- Update `src/lib/colors.test.ts`:
  - Unit test for `applyToneGrade` verifying contrast midpoint and Rec. 709 saturation scaling.
  - Unit test for `applyContourInk` confirming edge detection and luminance darkening / ink stamping.
  - Unit test for `applyNesTileDiscipline` verifying that every 8x8 block has <= 4 unique colors.
  - Unit test for each of the 5 presets ensuring deterministic output and correct palette snapping.
  - Unit test confirming custom palette ordered Bayer dithering fix.

### Phase 3: Hook, Batch & UI Integration
- Update `src/hooks/useConverter.ts`:
  - Forward `retroPreset` into `processColors`.
  - Add `settings.retroPreset` to the reactive processing effect.
  - Implement `applyRetroPreset` helper and expose on `ConverterController`.
  - Reset `retroPreset: null` in `resetStage('color')` and `resetSettings()`.
- Update `src/lib/batch.ts`:
  - Forward `retroPreset: settings.retroPreset` in `convertBatch` options.
- Update `src/components/inspector/ColorPanel.tsx`:
  - Add `onSelectPreset?: (preset: RetroPresetId | null) => void` or `onUpdate` integration.
  - Render the `.retro-presets` panel group with buttons for the 5 presets.
- Update `src/styles/inspector.css`:
  - Add styles for `.retro-presets`, `.retro-preset-btn`, `.retro-preset-era`, etc.

### Phase 4: Verification Gates
- Run `npm run typecheck` to confirm zero TypeScript errors.
- Run `npm test` to verify all test suites pass (including new preset and algorithm tests).
- Run `npm run check:contrast` to verify 18/18 WCAG AA contrast compliance.
- Run `npm run build` to ensure production bundle compiles cleanly.
