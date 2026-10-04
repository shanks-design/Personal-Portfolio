'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export type RailProject = { title: string; subtitle: string };

export type RailMetrics = {
  x: number;
  thumb: number;
  pitch: number;
  captionGap: number;
  openInset: number;
  activeShift: number;
  radius: number;
  subtitleColor: string;
};

const EASE = 'cubic-bezier(0.22, -0.01, 0.13, 0.99)';
const THUMB_H = 59;
const THUMB_PAD = 45;
const SMOOTHING = 0.1;
const SNAP_DELAY = 160;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function foldRem() {
  return Math.min(window.innerWidth, 1920) / 1600;
}

export default function ThumbRail({
  projects,
  active,
  onActiveChange,
  captionClassName,
  metrics,
  style,
}: {
  projects: readonly RailProject[];
  active: number;
  onActiveChange: (index: number) => void;
  captionClassName: string;
  metrics?: RailMetrics;
  style?: CSSProperties;
}) {
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;
  const count = projects.length;
  const railRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scroll = useRef(active);
  const target = useRef(active);
  const pitch = useRef(0);
  const height = useRef(0);
  const activeRef = useRef(active);
  const onActiveRef = useRef(onActiveChange);
  const seekRef = useRef<(index: number) => void>(() => {});
  const [copies, setCopies] = useState(3);
  const [hovered, setHovered] = useState<number | null>(null);

  onActiveRef.current = onActiveChange;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let snapTimer = 0;
    let touchY: number | null = null;

    const thumbH = () => metricsRef.current?.thumb ?? THUMB_H * foldRem();

    const measure = () => {
      pitch.current = metricsRef.current?.pitch ?? (THUMB_H + THUMB_PAD * 2) * foldRem();
      height.current = rail.clientHeight;
      const loop = count * pitch.current;
      setCopies(Math.ceil((height.current + pitch.current * 2) / loop) + 1);
    };

    const scheduleSnap = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        target.current = Math.round(target.current);
      }, SNAP_DELAY);
    };

    const push = (deltaPx: number) => {
      if (!pitch.current) return;
      target.current += deltaPx / pitch.current;
      scheduleSnap();
    };

    const tick = () => {
      const diff = target.current - scroll.current;
      scroll.current =
        reduced.matches || Math.abs(diff) < 0.0005
          ? target.current
          : scroll.current + diff * SMOOTHING;

      const p = pitch.current;
      const span = itemRefs.current.length * p;
      const center = height.current / 2 - thumbH() / 2;
      itemRefs.current.forEach((el, j) => {
        if (!el || !span) return;
        const u = mod(j * p - scroll.current * p, span);
        const y = center + (u > span / 2 ? u - span : u);
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
      if (span) rail.style.opacity = '1';

      const next = mod(Math.round(scroll.current), count);
      if (next !== activeRef.current) {
        activeRef.current = next;
        onActiveRef.current(next);
      }
      frame = requestAnimationFrame(tick);
    };

    seekRef.current = (index: number) => {
      const current = mod(Math.round(target.current), count);
      let delta = index - current;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      target.current = Math.round(target.current) + delta;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      push(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (touchY === null || y === undefined) return;
      e.preventDefault();
      push(touchY - y);
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      target.current = Math.round(target.current) + (e.key === 'ArrowDown' ? 1 : -1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(snapTimer);
      observer.disconnect();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [count]);

  const slots = Array.from({ length: count * copies }, (_, j) => j);
  const size = metrics ? `${metrics.thumb}px` : undefined;
  const inset = metrics ? `${metrics.openInset}px` : 'max(8px, 8 * var(--fold-rem))';
  const gap = metrics ? `${metrics.captionGap}px` : 'max(8px, 8 * var(--fold-rem))';

  return (
    <nav
      ref={railRef}
      aria-label="Selected work"
      className="absolute inset-y-0 overflow-hidden"
      style={{ left: 'var(--fold-margin)', width: 'var(--fold-col)', ...style, opacity: 0 }}
      onMouseLeave={() => setHovered(null)}
    >
      {slots.map((j) => {
        const index = j % count;
        const project = projects[index];
        const isActive = index === active;
        const isOpen = isActive || hovered === j;
        const primary = j < count;
        return (
          <button
            key={j}
            ref={(node) => {
              itemRefs.current[j] = node;
            }}
            type="button"
            tabIndex={primary ? 0 : -1}
            aria-hidden={primary ? undefined : true}
            aria-current={primary && isActive ? true : undefined}
            aria-label={`${project.title}, ${project.subtitle}`}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              left: metrics?.x,
              width: size ?? 'var(--fold-thumb-w)',
              height: size ?? 'var(--fold-thumb-h)',
            }}
            onMouseEnter={() => setHovered(j)}
            onFocus={() => setHovered(j)}
            onBlur={() => setHovered(null)}
            onClick={() => seekRef.current(index)}
          >
            <span
              className="block h-full w-full bg-[#E8E8E8]"
              style={{
                clipPath: isOpen
                  ? `inset(${inset} round ${metrics?.radius ?? 0}px)`
                  : `inset(0px round ${metrics?.radius ?? 0}px)`,
                transform:
                  metrics && isOpen ? `translate3d(${-metrics.activeShift}px, 0, 0)` : undefined,
                transition: `clip-path 1000ms ${EASE}, transform 1000ms ${EASE}`,
              }}
            />
            <span
              className="pointer-events-none absolute top-1/2 text-left"
              style={{
                left: `calc(100% + ${gap})`,
                opacity: isOpen ? 1 : 0,
                transform: `translate3d(${isOpen ? '0px' : gap}, -50%, 0)`,
                transition: `opacity 1000ms ${EASE}, transform 1000ms ${EASE}`,
              }}
            >
              <span className={`block whitespace-nowrap ${captionClassName}`}>
                {project.title}
              </span>
              <span
                className={`block whitespace-nowrap ${captionClassName}`}
                style={{ color: metrics?.subtitleColor ?? '#8A8A8A' }}
              >
                {project.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
