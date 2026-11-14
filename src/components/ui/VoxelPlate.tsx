import { useEffect, useRef } from 'react';
import { VOXEL_SCENES, type VoxelScene } from '../../constants';

/**
 * Voxel art plate: an original blocky landscape drawn at true pixel scale, 120 px tall and as wide as
 * the plate's aspect asks (192 to 520 px, the 192 px tile repeating), then shown pixelated. Sunset on the cover, the same world after dusk on the back cover. Motion is stepped
 * like the rest of the page: clouds drift a pixel per tick, the water glint swaps frames, stars
 * blink one at a time. Paused off screen and in hidden tabs; one still frame under reduced motion.
 */

/** One scene tile; wide plates repeat it so nothing is cropped away. */
const TILE = 192;
const MAX_W = 520;
const H = 120;
const HORIZON = 74;
const BLOCK = 8;
const GROUND = H - 6;
/** Height in blocks of each 8 px foreground column. */
const ISLAND = [0, 0, 1, 1, 2, 2, 2, 3, 3, 2, 2, 1, 1, 0, 0, 0, 1, 2, 3, 3, 4, 4, 3, 3];
const TREES: [column: number, trunk: number][] = [
  [3, 3],
  [19, 4],
  [22, 3],
];
const CLOUDS: [x: number, y: number, w: number][] = [
  [18, 14, 34],
  [104, 22, 46],
  [150, 9, 28],
  [6, 38, 22],
  [128, 44, 30],
];
const TICK_MS = 600;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

/** Fixed star field so the dusk sky is the same every visit. */
const STARS = (() => {
  const r = rng(41);
  return Array.from({ length: 60 }, () => [Math.floor(r() * MAX_W), Math.floor(r() * 40)] as const);
})();

/** One 600 ms tick drives everything: clouds every tick, glint every 900 ms, a star every 1.2 s. */
function draw(ctx: CanvasRenderingContext2D, c: VoxelScene, tick: number, W: number) {
  const tiles = Math.ceil(W / TILE);
  // Sun low on the left of the cover; the moon sits clear of the back cover title.
  const ORB_X = c.glow ? 62 : Math.round(W * 0.58);
  const glint = Math.floor((tick * 2) / 3);
  const star = Math.floor(tick / 2);
  const fill = (color: string, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  // Sky: stepped bands with a one-row checker dither at each seam.
  const bandH = HORIZON / c.sky.length;
  c.sky.forEach((color, i) => {
    const y0 = Math.round(i * bandH);
    const y1 = Math.round((i + 1) * bandH);
    fill(color, 0, y0, W, y1 - y0);
    const next = c.sky[i + 1];
    if (!next) return;
    for (let x = i % 2; x < W; x += 2) fill(next, x, y1 - 1, 1, 1);
    for (let x = (i + 1) % 2; x < W; x += 2) fill(color, x, y1, 1, 1);
  });

  // Stars: one dims per tick, in turn.
  if (c.stars) {
    const shown = STARS.filter(([x]) => x < W);
    shown.forEach(([x, y], i) => {
      if (i !== star % shown.length) fill(c.stars!, x, y, 1, 1);
    });
  }

  // Sun or moon: a stepped block disk on the horizon line.
  const orbY = c.glow ? HORIZON - 9 : 22;
  const disk = (radius: number, color: string) => {
    for (let dy = -radius; dy <= radius; dy += 2) {
      const half = Math.round(Math.sqrt(radius * radius - dy * dy) / 2) * 2;
      fill(color, ORB_X - half, orbY + dy, half * 2, 2);
    }
  };
  if (c.glow) disk(19, c.glow);
  disk(c.glow ? 15 : 9, c.orb);
  disk(c.glow ? 9 : 5, c.orbCore);

  // Clouds: block slabs with a lit underside, drifting one pixel per tick and wrapping.
  for (let k = 0; k < tiles; k += 1) for (const [x0, y, w] of CLOUDS) {
    const x = ((x0 + k * TILE + tick) % (W + w)) - w;
    fill(c.cloud, x, y, w, 4);
    fill(c.cloud, x + 4, y - 2, w - 10, 2);
    fill(c.cloudLit, x + 2, y + 4, w - 4, 2);
  }

  // Far and near ranges: blocky heightmaps in 4 px and 6 px columns.
  const range = (step: number, seed: number, start: number, min: number, max: number, jitter: number, color: string) => {
    const r = rng(seed);
    let h = start;
    for (let x = 0; x < W; x += step) {
      h = Math.max(min, Math.min(max, h + Math.round((r() - 0.5) * jitter)));
      fill(color, x, HORIZON - h, step, h);
    }
  };
  range(4, 11, 18, 6, 26, 6, c.far);
  range(6, 23, 8, 2, 16, 8, c.near);

  // Water, with the orb's reflection in stepped rows that swap between two frames.
  fill(c.water, 0, HORIZON, W, H - HORIZON);
  const shift = glint % 2 ? 2 : -2;
  for (let row = 0; row < 22; row += 2) {
    const w = Math.max(4, 30 - row * 1.2 + (row % 4 ? 6 : 0));
    const lit = (row / 2 + glint) % 2 === 0;
    fill(lit ? c.glint : c.sky[c.sky.length - 1], Math.round(ORB_X - w / 2 + (row % 6 ? shift : -shift)), HORIZON + 2 + row, Math.round(w), 1);
  }

  // Foreground island: 8 px grass blocks with lit tops over checkered dirt.
  for (let i = 0; i * BLOCK < W; i += 1) {
    const h = ISLAND[i % ISLAND.length];
    const x = i * BLOCK;
    if (x % TILE < 92 && h === 0 && i % ISLAND.length > 1) continue;
    const top = GROUND - (h + 1) * BLOCK;
    for (let y = top + BLOCK; y < H; y += BLOCK) {
      fill(c.dirt, x, y, BLOCK, BLOCK);
      fill(c.dirtDark, x + 2, y + 2, 2, 2);
      fill(c.dirtDark, x + 5, y + 5, 2, 2);
    }
    fill(c.grass, x, top, BLOCK, BLOCK);
    fill(c.grassLit, x, top, BLOCK, 2);
    fill(c.dirt, x + 1, top + 6, 2, 2);
    fill(c.dirt, x + 5, top + 6, 2, 2);
  }

  // Block trees.
  for (let k = 0; k < tiles; k += 1) for (const [column, trunk] of TREES) {
    const x = (column + k * ISLAND.length) * BLOCK + 2;
    if (x > W) continue;
    const base = GROUND - (ISLAND[column] + 1) * BLOCK;
    const top = base - trunk * 4;
    fill(c.trunk, x + 1, top, 4, trunk * 4);
    fill(c.leaf, x - 7, top - 12, 20, 14);
    fill(c.leafLit, x - 7, top - 12, 20, 3);
    fill(c.leafLit, x - 3, top - 18, 12, 6);
    fill(c.leaf, x - 3, top - 15, 12, 3);
  }
}

interface VoxelPlateProps {
  scene: 'sunset' | 'dusk';
  className?: string;
}

export function VoxelPlate({ scene, className }: VoxelPlateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const colors = VOXEL_SCENES[scene];
    let width = TILE;
    let tick = 0;
    let timer = 0;
    let visible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const paint = () => draw(ctx, colors, tick, width);
    const start = () => {
      if (reduced || timer || !visible || document.hidden) return;
      timer = window.setInterval(() => {
        tick += 1;
        paint();
      }, TICK_MS);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    viewObserver.observe(canvas);
    const sizeObserver = new ResizeObserver(() => {
      const box = canvas.getBoundingClientRect();
      const next = box.height > 0 ? Math.max(TILE, Math.min(MAX_W, Math.round((H * box.width) / box.height))) : TILE;
      if (next === width) return;
      width = next;
      canvas.width = width;
      paint();
    });
    sizeObserver.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    paint();
    start();

    return () => {
      stop();
      viewObserver.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [scene]);

  return (
    <canvas
      ref={canvasRef}
      className={`voxel${className ? ` ${className}` : ''}`}
      width={TILE}
      height={H}
      aria-hidden="true"
    />
  );
}
