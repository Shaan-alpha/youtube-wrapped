'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-cursor="hover"], input, textarea, select, label, summary';

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Latest pointer position (target).
  const target = useRef({ x: -100, y: -100 });
  // Eased ring position (chases target with lerp).
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    if (!ringEl || !dotEl) return;

    // Only run on devices with a real pointer and no reduced-motion preference.
    const supports = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!supports.matches) return;

    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      // Dot tracks 1:1 — feels precise.
      dotEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      ringEl.dataset.visible = 'true';
      dotEl.dataset.visible = 'true';

      const t = e.target as Element | null;
      const interactive = !!t?.closest(INTERACTIVE_SELECTOR);
      ringEl.dataset.hover = interactive ? 'true' : 'false';
      dotEl.dataset.hover = interactive ? 'true' : 'false';
    };

    const onDown = () => {
      ringEl.dataset.pressed = 'true';
      dotEl.dataset.pressed = 'true';
    };
    const onUp = () => {
      ringEl.dataset.pressed = 'false';
      dotEl.dataset.pressed = 'false';
    };
    const onLeave = () => {
      ringEl.dataset.visible = 'false';
      dotEl.dataset.visible = 'false';
    };
    const onEnter = () => {
      ringEl.dataset.visible = 'true';
      dotEl.dataset.visible = 'true';
    };

    const tick = () => {
      // Lerp ring toward target. 0.18 = snappy but still smooth.
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
