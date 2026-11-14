/* Contrast checker for beexie tokens: The Instruction Booklet in the Golden Hour Meadow palette.
 * Values mirror src/styles/tokens.css and VOXEL_SCENES in src/constants.ts.
 * Change a token there, change it here. WCAG AA: text >= 4.5:1, large text and UI boundaries >= 3:1.
 */

const light = {
  paper: '#f8fbf4',
  sheet: '#eef3e6',
  sheet2: '#e2eadb',
  ink: '#1d2a1f',
  inkMuted: '#4c5c4c',
  rule: '#1d2a1f',
  sun: '#ec6a20',
  onSun: '#1d2a1f',
  sunText: '#b4470c',
  gold: '#ffd23f',
  onGold: '#1d2a1f',
  grass: '#2f7a2a',
  onGrass: '#ffffff',
  grassText: '#2f7a2a',
  tide: '#2f7f8f',
  onTide: '#ffffff',
  focus: '#2f7a2a',
  success: '#2f7a2a',
  danger: '#b42318',
  onDanger: '#ffffff',
};

const dark = {
  paper: '#141c16',
  sheet: '#1d2a1f',
  sheet2: '#26342a',
  ink: '#f1f7ea',
  inkMuted: '#adbda9',
  rule: '#8a9c88',
  sun: '#ff8a3d',
  onSun: '#141c16',
  sunText: '#ff9d5c',
  gold: '#ffd23f',
  onGold: '#141c16',
  grass: '#7ccf4f',
  onGrass: '#141c16',
  grassText: '#7ccf4f',
  tide: '#4fb3c4',
  onTide: '#141c16',
  focus: '#7ccf4f',
  success: '#7ccf4f',
  danger: '#ff8a75',
  onDanger: '#141c16',
};

// Chips and text on the voxel art plates use the same colors in both themes.
const chip = '#f8fbf4';
const chipInk = '#1d2a1f';
const sunsetSky = ['#2b5f8a', '#4a86a8', '#7fb3bf', '#f6c76b', '#ff9f43', '#ff7a2f'];
const duskSky = ['#0d1626', '#13233a', '#1d3550', '#2b5f8a', '#3d6b7a'];

function lum(hex) {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = ch.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const pairs = (t) => [
  ['ink on paper', t.ink, t.paper, 4.5],
  ['ink on sheet', t.ink, t.sheet, 4.5],
  ['ink on sheet-2', t.ink, t.sheet2, 4.5],
  ['muted ink on paper', t.inkMuted, t.paper, 4.5],
  ['muted ink on sheet', t.inkMuted, t.sheet, 4.5],
  ['muted ink on sheet-2', t.inkMuted, t.sheet2, 4.5],
  ['rule on paper', t.rule, t.paper, 3.0],
  ['text on sun plate', t.onSun, t.sun, 4.5],
  ['text on gold plate', t.onGold, t.gold, 4.5],
  ['text on grass plate', t.onGrass, t.grass, 4.5],
  ['text on tide plate', t.onTide, t.tide, 4.5],
  ['sun text on paper', t.sunText, t.paper, 4.5],
  ['grass text on paper', t.grassText, t.paper, 4.5],
  ['focus ring on paper', t.focus, t.paper, 3.0],
  ['focus ring on sheet', t.focus, t.sheet, 3.0],
  ['success on paper', t.success, t.paper, 4.5],
  ['danger on paper', t.danger, t.paper, 4.5],
  ['danger on sheet', t.danger, t.sheet, 4.5],
  ['text on danger alert', t.onDanger, t.danger, 4.5],
];

// Voxel plates: chip edges against the darkest sky, chip text, and the back cover title
// (large display text set straight on the dusk sky) against every dusk band.
const plates = [
  ['all', 'chip ink on chip', chipInk, chip, 4.5],
  ['all', 'chip edge on sunset top sky', chip, sunsetSky[0], 3.0],
  ...duskSky.map((band, i) => ['all', `back cover title on dusk sky ${i + 1}`, chip, band, 3.0]),
];

const checks = [
  ...plates,
  ...pairs(light).map((p) => ['light', ...p]),
  ...pairs(dark).map((p) => ['dark', ...p]),
];

let failed = 0;
for (const [theme, name, fg, bg, min] of checks) {
  const value = contrast(fg, bg);
  const pass = value >= min;
  if (!pass) failed += 1;
  console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${theme} ${name}: ${value.toFixed(2)}:1 (min ${min}:1)`);
}

if (failed) {
  console.error(`\n${failed} contrast check(s) FAILED.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} WCAG AA contrast checks passed.`);
