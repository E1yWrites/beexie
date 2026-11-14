import React, { useEffect, useRef } from 'react';
import type { Theme } from '../../types';

interface FloatingPathSpec {
  path2d: Path2D;
  width: number;
  opacity: number;
  duration: number;
  phase: number;
}

function buildFloatingPaths(position: 1 | -1): FloatingPathSpec[] {
  return Array.from({ length: 36 }, (_, i) => {
    const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
    return {
      path2d: new Path2D(d),
      width: 0.6 + i * 0.024,
      opacity: 0.022 + i * 0.0022,
      duration: 20 + ((i * 7) % 11),
      phase: ((i * 0.137) % 1),
    };
  });
}

const VIEW_W = 696;
const VIEW_H = 316;
const PATH_SPAN = 1480;

interface BackgroundPathsProps {
  /** Pauses animated stroke flow in the Studio workbench to keep color evaluation calm. */
  paused?: boolean;
  theme?: Theme;
}

export const BackgroundPaths: React.FC<BackgroundPathsProps> = ({ paused = false, theme = 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const themeRef = useRef<Theme>(theme);
  const redrawRef = useRef<(() => void) | null>(null);

  pausedRef.current = paused;
  themeRef.current = theme;

  useEffect(() => {
    redrawRef.current?.();
  }, [theme, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const allPaths = [...buildFloatingPaths(1), ...buildFloatingPaths(-1)];
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cssW = 1;
    let cssH = 1;
    let dpr = 1;
    let rafId = 0;
    let running = false;
    const startTime = performance.now();

    const drawFrame = (now: number) => {
      const isStatic = pausedRef.current || reducedMotionQuery.matches;
      const elapsed = isStatic ? 0 : (now - startTime) * 0.001;
      const isDark = themeRef.current === 'dark';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // Replicate SVG preserveAspectRatio="xMidYMid slice" from viewBox(696 x 316)
      const scale = Math.max(cssW / VIEW_W, cssH / VIEW_H);
      const offsetX = (cssW - VIEW_W * scale) * 0.5;
      const offsetY = (cssH - VIEW_H * scale) * 0.5;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      ctx.strokeStyle = isDark ? '#cfd6e6' : '#1e2330';
      ctx.lineCap = 'round';

      const dashLen = PATH_SPAN * 0.58;
      const gapLen = PATH_SPAN * 0.42;
      const toneScale = isDark ? 0.88 : 1;

      for (const item of allPaths) {
        // Keep stroke thickness in true CSS pixels regardless of viewport cover scaling
        ctx.lineWidth = item.width / scale;
        if (isStatic) {
          ctx.globalAlpha = item.opacity * toneScale * 0.55;
          ctx.setLineDash([]);
          ctx.lineDashOffset = 0;
        } else {
          const progress = (elapsed / item.duration + item.phase) % 1;
          const wave = 0.48 + 0.48 * (0.5 - 0.5 * Math.cos(progress * Math.PI * 2));
          ctx.globalAlpha = item.opacity * toneScale * wave;
          ctx.setLineDash([dashLen, gapLen]);
          ctx.lineDashOffset = (1 - progress) * PATH_SPAN;
        }
        ctx.stroke(item.path2d);
      }

      ctx.restore();
    };

    redrawRef.current = () => drawFrame(performance.now());

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = Math.max(1, window.innerWidth);
      cssH = Math.max(1, window.innerHeight);
      const nextW = Math.round(cssW * dpr);
      const nextH = Math.round(cssH * dpr);
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      drawFrame(performance.now());
    };

    const tick = (now: number) => {
      rafId = 0;
      drawFrame(now);
      if (running && !document.hidden && !pausedRef.current && !reducedMotionQuery.matches) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      if (document.hidden || pausedRef.current || reducedMotionQuery.matches) {
        drawFrame(performance.now());
        return;
      }
      running = true;
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      running = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        resize();
        startLoop();
      }
    };

    resize();
    startLoop();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    reducedMotionQuery.addEventListener('change', onVisibility);

    return () => {
      redrawRef.current = null;
      stopLoop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotionQuery.removeEventListener('change', onVisibility);
    };
  }, [paused]);

  return (
    <div className="bg-paths" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-paths-canvas" />
    </div>
  );
};
