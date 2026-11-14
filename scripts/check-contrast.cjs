/* Contrast checker for beexie Spot-Ink Proof Studio tokens.
 * Light and dark token values taken from src/styles/tokens.css.
 * Verifies WCAG AA contrast: body text >= 4.5:1, UI boundaries >= 3:1.
 */

const lightTokens = {
  paper: '#f8f6f1',
  panel: '#ffffff',
  panel2: '#f1eee7',
  line: '#6b6860',
  lineStrong: '#15171c',
  ink: '#111317',
  ink2: '#3d414a',
  ink3: '#575b64',
  accent: '#1e46e8',
  accentText: '#1e46e8',
  vermilionText: '#c23117',
  cyan: '#0369a1',
  amber: '#a15206',
  danger: '#c23117',
};

const darkTokens = {
  paper: '#12141a',
  panel: '#191c23',
  panel2: '#222630',
  line: '#8c92a0',
  lineStrong: '#c6cbd6',
  ink: '#f5f6f8',
  ink2: '#c6cbd6',
  ink3: '#9ea5b5',
  accent: '#2d55eb',
  accentText: '#85aaff',
  vermilionText: '#ff8770',
  cyan: '#38bdf8',
  amber: '#fbbf24',
  danger: '#ff8770',
};

function hexToLum(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const toLum = (c) => {
    const c_ = c / 255;
    return c_ <= 0.03928 ? c_ / 12.92 : ((c_ + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLum(r) + 0.7152 * toLum(g) + 0.0722 * toLum(b);
}

function contrast(fgHex, bgHex) {
  const l1 = hexToLum(fgHex);
  const l2 = hexToLum(bgHex);
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
}

const checks = [
  { name: 'Light body (ink on paper)', value: contrast(lightTokens.ink, lightTokens.paper), min: 4.5, theme: 'light' },
  { name: 'Light muted (ink3 on panel2)', value: contrast(lightTokens.ink3, lightTokens.panel2), min: 4.5, theme: 'light' },
  { name: 'Light border on panel', value: contrast(lightTokens.line, lightTokens.panel), min: 3.0, theme: 'light' },
  { name: 'Light accent text on paper', value: contrast(lightTokens.accentText, lightTokens.paper), min: 4.5, theme: 'light' },
  { name: 'Light accent text on panel', value: contrast(lightTokens.accentText, lightTokens.panel), min: 4.5, theme: 'light' },
  { name: 'Light CTA white on accent', value: contrast('#ffffff', lightTokens.accent), min: 4.5, theme: 'light' },
  { name: 'Light vermilion text on panel', value: contrast(lightTokens.vermilionText, lightTokens.panel), min: 4.5, theme: 'light' },
  { name: 'Light cyan on paper', value: contrast(lightTokens.cyan, lightTokens.paper), min: 4.5, theme: 'light' },
  { name: 'Light amber on paper', value: contrast(lightTokens.amber, lightTokens.paper), min: 4.5, theme: 'light' },

  { name: 'Dark body (ink on paper)', value: contrast(darkTokens.ink, darkTokens.paper), min: 4.5, theme: 'dark' },
  { name: 'Dark muted (ink3 on panel2)', value: contrast(darkTokens.ink3, darkTokens.panel2), min: 4.5, theme: 'dark' },
  { name: 'Dark border on panel', value: contrast(darkTokens.line, darkTokens.panel), min: 3.0, theme: 'dark' },
  { name: 'Dark accent text on paper', value: contrast(darkTokens.accentText, darkTokens.paper), min: 4.5, theme: 'dark' },
  { name: 'Dark accent text on panel', value: contrast(darkTokens.accentText, darkTokens.panel), min: 4.5, theme: 'dark' },
  { name: 'Dark CTA white on accent', value: contrast('#ffffff', darkTokens.accent), min: 4.5, theme: 'dark' },
  { name: 'Dark vermilion text on panel', value: contrast(darkTokens.vermilionText, darkTokens.panel), min: 4.5, theme: 'dark' },
  { name: 'Dark cyan on paper', value: contrast(darkTokens.cyan, darkTokens.paper), min: 4.5, theme: 'dark' },
  { name: 'Dark amber on paper', value: contrast(darkTokens.amber, darkTokens.paper), min: 4.5, theme: 'dark' },
];

let allPass = true;
for (const c of checks) {
  const pass = c.value >= c.min;
  if (!pass) allPass = false;
  console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${c.theme} ${c.name}: ${c.value.toFixed(2)}:1 (min ${c.min}:1)`);
}

if (!allPass) {
  console.error('\nContrast checks FAILED.');
  process.exit(1);
}
console.log('\nAll 18 WCAG AA contrast checks passed.');
