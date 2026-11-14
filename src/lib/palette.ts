/** Split the palette into packed comb rows. Cells are 44px wide, so callers
 *  derive perRow from the measured comb width to keep 44px hit targets. */
export function paletteRows<T>(colors: readonly T[], perRow = 8): T[][] {
  const size = Math.max(1, Math.floor(perRow));
  const rows: T[][] = [];
  for (let index = 0; index < colors.length; index += size) {
    rows.push(colors.slice(index, index + size));
  }
  return rows;
}
