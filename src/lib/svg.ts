import type { RgbaImage } from '../types';

const hex = (r: number, g: number, b: number) => `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

/**
 * Vector export: one rect per horizontal run of same-colored opaque pixels, viewBox at grid size,
 * so the art scales without loss. Fully transparent pixels emit nothing.
 */
export function processedToSvg(image: RgbaImage, width: number, height: number, background: string | null): string {
  const { data } = image;
  const rects: string[] = [];
  if (background) rects.push(`<rect width="${image.width}" height="${image.height}" fill="${background}"/>`);

  for (let y = 0; y < image.height; y += 1) {
    let x = 0;
    while (x < image.width) {
      const i = (y * image.width + x) * 4;
      const alpha = data[i + 3];
      let end = x + 1;
      while (
        end < image.width &&
        data[i + (end - x) * 4] === data[i] &&
        data[i + (end - x) * 4 + 1] === data[i + 1] &&
        data[i + (end - x) * 4 + 2] === data[i + 2] &&
        data[i + (end - x) * 4 + 3] === alpha
      ) {
        end += 1;
      }
      if (alpha > 0) {
        const opacity = alpha < 255 ? ` fill-opacity="${+(alpha / 255).toFixed(3)}"` : '';
        rects.push(`<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${hex(data[i], data[i + 1], data[i + 2])}"${opacity}/>`);
      }
      x = end;
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${image.width} ${image.height}" shape-rendering="crispEdges">` +
    rects.join('') +
    '</svg>\n'
  );
}
