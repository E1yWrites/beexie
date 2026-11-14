import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { chartLayout } from '../src/lib/chart';

type Mime = 'image/png' | 'image/jpeg' | 'image/webp';

/** Encode a real 120 x 60 gradient image in the browser, so no binary fixtures live in the repo. */
async function makeImage(page: Page, mime: Mime): Promise<Buffer> {
  const bytes = await page.evaluate(async (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 60;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 120, 60);
    gradient.addColorStop(0, '#d81e28');
    gradient.addColorStop(0.5, '#ffc81e');
    gradient.addColorStop(1, '#2449e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 120, 60);
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), type, 0.9));
    if (blob.type !== type) throw new Error(`browser cannot encode ${type}`);
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  }, mime);
  return Buffer.from(bytes);
}

/** Width and height from a PNG IHDR chunk. */
function pngSize(file: Buffer): { width: number; height: number } {
  expect(file.subarray(1, 4).toString('ascii')).toBe('PNG');
  return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}

test('upload every format, change settings, download a real PNG', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Studio' }).first().click();

  const fileInput = page.locator('input[type="file"]');
  for (const [mime, ext] of [
    ['image/png', 'png'],
    ['image/jpeg', 'jpg'],
    ['image/webp', 'webp'],
  ] as const) {
    await fileInput.setInputFiles({ name: `fixture.${ext}`, mimeType: mime, buffer: await makeImage(page, mime) });
    await expect(page.getByRole('status').or(page.getByRole('alert')).filter({ hasText: `fixture.${ext}` })).toBeVisible();
  }

  await page.getByRole('button', { name: /^Grid/ }).click();
  await page.getByRole('group', { name: 'Pixel resolution presets' }).getByRole('button', { name: /^32/ }).click();
  await expect(page.getByRole('group', { name: 'Pixel resolution presets' }).getByRole('button', { name: /^32/ })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: /^Color/ }).click();
  await page.getByRole('group', { name: 'Color mode' }).getByRole('button', { name: 'Gray' }).click();
  await expect(page.getByRole('group', { name: 'Color mode' }).getByRole('button', { name: 'Gray' })).toHaveAttribute('aria-pressed', 'true');
  // The native checkbox is visually hidden behind the styled track, so click the label like a user does.
  await page.getByText('Dither', { exact: true }).click();
  await expect(page.getByRole('checkbox', { name: /^Dither/ })).toBeChecked();

  await page.getByRole('group', { name: 'Export scale multiplier' }).getByRole('button', { name: '4x' }).click();
  await expect(page.getByRole('group', { name: 'Export scale multiplier' }).getByRole('button', { name: '4x' })).toHaveAttribute('aria-pressed', 'true');

  const output = page.locator('.exportbar-out b');
  await expect(output).toHaveAttribute('aria-label', /^\d+ × \d+ px$/);
  const [, w, h] = (await output.getAttribute('aria-label'))!.match(/^(\d+) × (\d+) px$/)!;

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download PNG' }).click(),
  ]);
  const size = pngSize(readFileSync((await download.path())!));

  expect(size).toEqual({ width: Number(w), height: Number(h) });
  // 120 x 60 source at the 32 preset is a 32 x 16 grid; auto output 512 x 256; 4x scale.
  expect(size).toEqual({ width: 2048, height: 1024 });

  await page.getByRole('group', { name: 'Export format' }).getByRole('button', { name: 'SVG' }).click();
  const [svgDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download SVG' }).click(),
  ]);
  const svg = readFileSync((await svgDownload.path())!, 'utf8');
  expect(svgDownload.suggestedFilename()).toMatch(/\.svg$/);
  expect(svg).toContain('width="2048" height="1024" viewBox="0 0 32 16" shape-rendering="crispEdges"');

  await page.getByRole('button', { name: /^Finish,/ }).click();
  const [chartDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download maker chart' }).click(),
  ]);
  expect(chartDownload.suggestedFilename()).toMatch(/-chart-32x16\.png$/);
  const chart = readFileSync((await chartDownload.path())!);
  // Width is fixed by the grid; height grows by one legend row per few colors, so check it lands on a row.
  const empty = chartLayout(32, 16, 0);
  const chartSize = pngSize(chart);
  expect(chartSize.width).toBe(empty.width);
  const legendRows = (chartSize.height - empty.height) / 28;
  expect(Number.isInteger(legendRows) && legendRows >= 1).toBe(true);

  // Turning the 2:1 source a quarter turn flips the 32 x 16 grid to 16 x 32.
  await page.getByRole('button', { name: /^Image,/ }).click();
  await page.getByRole('button', { name: 'Rotate right' }).click();
  await expect(page.getByRole('button', { name: /^Grid,/ })).toHaveAccessibleName(/16 × 32/);
});
