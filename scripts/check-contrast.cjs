/* Contrast checker for beexie "Instruction Booklet" tokens.
 * Values mirror src/styles/tokens.css. Change a token there, change it here.
 * WCAG AA: text >= 4.5:1, UI boundaries >= 3:1.
 */

const light = {
  paper: '#ffffff',
  sheet: '#f3f3f5',
  ink: '#16161a',
  inkMuted: '#5a5a63',
  rule: '#16161a',
  red: '#d81e28',
  onRed: '#ffffff',
  redText: '#c4121c',
  yellow: '#ffc81e',
  onYellow: '#16161a',
  blue: '#2449e0',
  onBlue: '#ffffff',
  blueText: '#2449e0',
  success: '#13703c',
  danger: '#c4121c',
};

const dark = {
  paper: '#1d1e22',
  sheet: '#26272c',
  ink: '#f2f2f4',
  inkMuted: '#a3a3ad',
  rule: '#8d8e97',
  red: '#d81e28',
  onRed: '#ffffff',
  redText: '#ff6b6b',
  yellow: '#ffd23f',
  onYellow: '#16161a',
  blue: '#2449e0',
  onBlue: '#ffffff',
  blueText: '#7f9cff',
  success: '#4ade80',
  danger: '#ff6b6b',
};

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
  ['muted ink on paper', t.inkMuted, t.paper, 4.5],
  ['muted ink on sheet', t.inkMuted, t.sheet, 4.5],
  ['rule on paper', t.rule, t.paper, 3.0],
  ['text on red plate', t.onRed, t.red, 4.5],
  ['text on yellow plate', t.onYellow, t.yellow, 4.5],
  ['text on blue plate', t.onBlue, t.blue, 4.5],
  ['red text on paper', t.redText, t.paper, 4.5],
  ['blue text on paper', t.blueText, t.paper, 4.5],
  ['success on paper', t.success, t.paper, 4.5],
  ['danger on sheet', t.danger, t.sheet, 4.5],
];

// Silk art plates: worst case is white text on the brightest sheen the shader can draw
// (peak color x 1.11 plus grain), see src/components/ui/SilkPlate.tsx.
const silk = [
  ['all', 'white on maroon plate fallback', '#ffffff', '#7a1424', 4.5],
  ['all', 'white on cover silk peak', '#ffffff', '#cb2f45', 4.5],
  ['all', 'white on back cover silk peak', '#ffffff', '#335cfd', 4.5],
];

const checks = [
  ...silk,
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
