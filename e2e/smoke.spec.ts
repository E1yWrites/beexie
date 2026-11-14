import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

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

  await page.getByRole('button', { name: /^Color/ }).click();
  await page.getByRole('group', { name: 'Color mode' }).getByRole('button', { name: 'Gray' }).click();
  // The native checkbox is visually hidden behind the styled track, so click the label like a user does.
  await page.getByText('Dither', { exact: true }).click();
  await expect(page.getByRole('checkbox', { name: /^Dither/ })).toBeChecked();

  await page.getByRole('group', { name: 'Export scale multiplier' }).getByRole('button', { name: '4x' }).click();

  const output = page.locator('.exportbar-out b');
  await expect(output).toHaveAttribute('aria-label', /^\d+ × \d+ px$/);
  const [, w, h] = (await output.getAttribute('aria-label'))!.match(/^(\d+) × (\d+) px$/)!;

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download PNG' }).click(),
  ]);
  const size = pngSize(readFileSync((await download.path())!));

  expect(size).toEqual({ width: Number(w), height: Number(h) });
  // 32 cells on the long side, 4x scale, 2:1 source.
  expect(size.width % 4).toBe(0);
  expect(size.width / size.height).toBeCloseTo(2, 1);
});
