'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-cursor="hover"], input, textarea, select, label, summary';

export function Cursor() {
  const ringPosRef = useRef<HTMLDivElement>(null);
  const dotPosRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const ringEl = ringPosRef.current;
    const dotEl = dotPosRef.current;
    if (!ringEl || !dotEl) return;

    const supports = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!supports.matches) return;

    document.documentElement.classList.add('has-custom-cursor');

    const setBoth = (key: string, value: string) => {
      ringEl.dataset[key] = value;
      dotEl.dataset[key] = value;
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      // The dot tracks 1:1 — only its outer wrapper translates.
      dotEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      setBoth('visible', 'true');

      const t = e.target as Element | null;
      setBoth('hover', t?.closest(INTERACTIVE_SELECTOR) ? 'true' : 'false');
    };

    const onDown = () => setBoth('pressed', 'true');
    const onUp = () => setBoth('pressed', 'false');
    const onLeave = () => setBoth('visible', 'false');
    const onEnter = () => setBoth('visible', 'true');

    const tick = () => {
      // Lerp ring toward target.
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
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
      {/* Ring: outer wrapper takes the position, middle centers, inner scales/pulses */}
      <div ref={ringPosRef} className="cursor-pos cursor-pos--ring" aria-hidden="true">
        <div className="cursor-center cursor-center--ring">
          <div className="cursor-ring" />
        </div>
      </div>

      {/* Dot: same nested structure so press-scale stays centered */}
      <div ref={dotPosRef} className="cursor-pos cursor-pos--dot" aria-hidden="true">
        <div className="cursor-center cursor-center--dot">
          <div className="cursor-dot" />
        </div>
      </div>
    </>
  );
}
