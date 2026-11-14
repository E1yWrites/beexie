import { useEffect } from 'react';

/**
 * Tracks cursor position cleanly across `[data-spotlight]` cards and drives
 * `--spot-x`, `--spot-y`, and `--spot-active` CSS variables for the pure-accent spotlight glow.
 */
export function useSpotlightCards(scopeKey: string) {
  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!hoverQuery.matches || motionQuery.matches) return;

    let rafId = 0;
    let lastX = -9999;
    let lastY = -9999;
    let active = false;

    const updateCards = () => {
      rafId = 0;
      const cards = document.querySelectorAll<HTMLElement>('[data-spotlight]');
      cards.forEach((card) => {
        if (!active) {
          card.style.setProperty('--spot-active', '0');
          return;
        }
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${Math.round(lastX - rect.left)}px`);
        card.style.setProperty('--spot-y', `${Math.round(lastY - rect.top)}px`);
        card.style.setProperty('--spot-active', '1');
      });
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateCards);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      active = true;
      scheduleUpdate();
    };

    const onPointerLeave = () => {
      active = false;
      scheduleUpdate();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', scheduleUpdate);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, [scopeKey]);
}
