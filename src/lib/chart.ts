import { MAX_EXPORT_DIMENSION } from '../constants';
import type { RgbaImage } from '../types';

/** Plain ASCII so any font draws them; I, O, 0, 1 and l are left out because they read alike. */
export const CHART_SYMBOLS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abdefghkmnqrtuvwxyz+=#%&?'.split('').slice(0, 48);

export interface ColorCount {
  color: string;
  count: number;
  symbol: string;
}

const hex = (r: number, g: number, b: number) => `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

/** Stitch or bead count per color, most used first; transparent pixels are not counted. */
export function countColors(image: RgbaImage): ColorCount[] {
  const counts = new Map<string, number>();
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) continue;
    const key = hex(image.data[i], image.data[i + 1], image.data[i + 2]);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([color, count], index) => ({ color, count, symbol: CHART_SYMBOLS[index] ?? String(index + 1) }));
}

export const CHART_MARGIN = 24;
export const CHART_RULER = 32;
export const LEGEND_ROW = 28;
export const LEGEND_COLUMN = 220;
export const LEGEND_TITLE = 44;

export interface ChartLayout {
  cell: number;
  gridX: number;
  gridY: number;
  legendY: number;
  legendColumns: number;
  width: number;
  height: number;
  symbols: boolean;
}

export function chartLayout(gridWidth: number, gridHeight: number, colors: number): ChartLayout {
  const budget = MAX_EXPORT_DIMENSION - 2 * CHART_MARGIN - CHART_RULER - 2000;
  const cell = Math.max(4, Math.min(24, Math.floor(budget / Math.max(gridWidth, gridHeight))));
  const gridX = CHART_MARGIN + CHART_RULER;
  const gridY = CHART_MARGIN + CHART_RULER;
  const width = Math.max(gridX + gridWidth * cell + CHART_MARGIN, 2 * CHART_MARGIN + 2 * LEGEND_COLUMN);
  const legendColumns = Math.max(1, Math.floor((width - 2 * CHART_MARGIN) / LEGEND_COLUMN));
  const legendY = gridY + gridHeight * cell + CHART_MARGIN;
  const height = legendY + LEGEND_TITLE + Math.ceil(colors / legendColumns) * LEGEND_ROW + CHART_MARGIN;
  return { cell, gridX, gridY, legendY, legendColumns, width, height, symbols: cell >= 10 };
}

const luminance = (color: string) => {
  const n = parseInt(color.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/** Printable maker chart: symbol grid with rulers and a bold rule every 10 cells, then a counted legend. */
export function drawChart(image: RgbaImage): HTMLCanvasElement {
  const colors = countColors(image);
  const symbolOf = new Map(colors.map((c) => [c.color, c.symbol]));
  const layout = chartLayout(image.width, image.height, colors.length);
  const { cell, gridX, gridY } = layout;

  const canvas = document.createElement('canvas');
  canvas.width = layout.width;
  canvas.height = layout.height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `700 ${Math.round(cell * 0.6)}px ui-monospace, monospace`;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const i = (y * image.width + x) * 4;
      if (image.data[i + 3] === 0) continue;
      const color = hex(image.data[i], image.data[i + 1], image.data[i + 2]);
      ctx.fillStyle = color;
      ctx.fillRect(gridX + x * cell, gridY + y * cell, cell, cell);
      if (layout.symbols) {
        ctx.fillStyle = luminance(color) > 0.5 ? '#16161a' : '#ffffff';
        ctx.fillText(symbolOf.get(color)!, gridX + x * cell + cell / 2, gridY + y * cell + cell / 2 + 1);
      }
    }
  }

  const gridRight = gridX + image.width * cell;
  const gridBottom = gridY + image.height * cell;
  const line = (x1: number, y1: number, x2: number, y2: number, width: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  for (let x = 0; x <= image.width; x += 1) {
    const major = x % 10 === 0 || x === image.width;
    if (!major && cell < 8) continue;
    line(gridX + x * cell + 0.5, gridY, gridX + x * cell + 0.5, gridBottom, major ? 2 : 1, major ? '#16161a' : 'rgba(22,22,26,0.35)');
  }
  for (let y = 0; y <= image.height; y += 1) {
    const major = y % 10 === 0 || y === image.height;
    if (!major && cell < 8) continue;
    line(gridX, gridY + y * cell + 0.5, gridRight, gridY + y * cell + 0.5, major ? 2 : 1, major ? '#16161a' : 'rgba(22,22,26,0.35)');
  }

  ctx.fillStyle = '#16161a';
  ctx.font = '700 11px ui-monospace, monospace';
  for (let x = 0; x < image.width; x += 1) {
    if (x === 0 || (x + 1) % 10 === 0) ctx.fillText(String(x + 1), gridX + x * cell + cell / 2, gridY - CHART_RULER / 2);
  }
  ctx.textAlign = 'right';
  for (let y = 0; y < image.height; y += 1) {
    if (y === 0 || (y + 1) % 10 === 0) ctx.fillText(String(y + 1), gridX - 6, gridY + y * cell + cell / 2);
  }

  ctx.textAlign = 'left';
  ctx.font = '700 16px ui-sans-serif, system-ui, sans-serif';
  const total = colors.reduce((sum, c) => sum + c.count, 0);
  ctx.fillText(
    `${image.width} x ${image.height} grid, ${colors.length} colors, ${total} stitches`,
    CHART_MARGIN,
    layout.legendY + LEGEND_TITLE / 2 - 4,
  );
  ctx.font = '700 13px ui-monospace, monospace';
  colors.forEach((c, index) => {
    const x = CHART_MARGIN + (index % layout.legendColumns) * LEGEND_COLUMN;
    const y = layout.legendY + LEGEND_TITLE + Math.floor(index / layout.legendColumns) * LEGEND_ROW;
    ctx.fillStyle = c.color;
    ctx.fillRect(x, y, 22, 22);
    ctx.strokeStyle = '#16161a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, 21, 21);
    ctx.fillStyle = luminance(c.color) > 0.5 ? '#16161a' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(c.symbol, x + 11, y + 12);
    ctx.fillStyle = '#16161a';
    ctx.textAlign = 'left';
    ctx.fillText(`${c.color}  x${c.count}`, x + 30, y + 12);
  });

  return canvas;
}
