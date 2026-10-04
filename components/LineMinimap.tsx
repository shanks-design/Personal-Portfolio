'use client';

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';

const TICK_COUNT = 37;
const TICK_H = 60;
const PILL_H = 25;
const PILL_TICK_GAP = 20;
const STEP = 10;
const TRACK = STEP * (TICK_COUNT - 1);
const RULER_H = PILL_H + PILL_TICK_GAP + TICK_H;
const SIGMA = 7.2 * STEP;
const TWO_SIGMA_SQ = 2 * SIGMA * SIGMA;

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function visualFromProgress(progress: number, projects: number) {
  if (projects <= 1) return 0;
  return clamp((progress * projects) / (projects - 1), 0, 1);
}

function progressFromVisual(t: number, projects: number) {
  if (projects <= 1) return 0;
  return clamp(t, 0, 1) * ((projects - 1) / projects);
}

function falloff(distance: number) {
  const g = Math.exp(-(distance * distance) / TWO_SIGMA_SQ);
  return {
    scaleY: 0.15 + 0.85 * g,
    opacity: 0.28 + 0.32 * g,
  };
}

export default function LineMinimap({
  progress,
  labels,
  activeIndex,
  onSeek,
  onScrub,
}: {
  progress: MotionValue<number>;
  labels: readonly string[];
  activeIndex: number;
  onSeek?: (progress: number) => void;
  onScrub?: (progress: number) => void;
}) {
  const projects = Math.max(1, labels.length);
  const dragging = useRef(false);
  const tickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastProgress = useRef(0);
  const headX = useSpring(0, { stiffness: 500, damping: 40, mass: 0.8 });
  const liveX = useMotionValue(0);
  const [label, setLabel] = useState(labels[activeIndex] ?? '');

  const paint = (x: number) => {
    liveX.set(x);
    for (let i = 0; i < TICK_COUNT; i++) {
      const el = tickRefs.current[i];
      if (!el) continue;
      const { scaleY, opacity } = falloff(x - i * STEP);
      el.style.transform = `translateX(${i * STEP}px) scaleY(${scaleY})`;
      el.style.opacity = String(opacity);
    }
  };

  const labelFromProgress = (value: number) => {
    const index = ((Math.round(value * projects) % projects) + projects) % projects;
    const nextLabel = labels[index] ?? '';
    setLabel((current) => (current === nextLabel ? current : nextLabel));
  };

  useMotionValueEvent(headX, 'change', paint);

  useMotionValueEvent(progress, 'change', (latest) => {
    if (dragging.current) return;
    const jumped = Math.abs(latest - lastProgress.current) > 0.5;
    lastProgress.current = latest;
    labelFromProgress(latest);
    const next = visualFromProgress(latest, projects) * TRACK;
    if (jumped) headX.jump(next);
    else headX.set(next);
  });

  useEffect(() => {
    const x = visualFromProgress(progress.get(), projects) * TRACK;
    headX.jump(x);
    paint(x);
  }, [projects]);

  const pointToVisual = (clientX: number, left: number, width: number) => {
    if (width <= 0) return 0;
    return clamp((clientX - left) / width, 0, 1);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = pointToVisual(e.clientX, rect.left, rect.width);
    const x = t * TRACK;
    headX.jump(x);
    paint(x);
    const nearest = Math.round(t * (projects - 1));
    setLabel(labels[nearest] ?? '');
    onScrub?.(progressFromVisual(t, projects));
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = pointToVisual(e.clientX, rect.left, rect.width);
    const x = t * TRACK;
    headX.jump(x);
    paint(x);
    const nearest = Math.round(t * (projects - 1));
    setLabel(labels[nearest] ?? '');
    onScrub?.(progressFromVisual(t, projects));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = pointToVisual(e.clientX, rect.left, rect.width);
    const index = Math.round(t * (projects - 1));
    onSeek?.(index / projects);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: TRACK + 2, height: RULER_H }}
        aria-label="Project timeline"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={projects - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={labels[activeIndex]}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            onSeek?.(((activeIndex + 1) % projects) / projects);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onSeek?.(((activeIndex - 1 + projects) % projects) / projects);
          }
        }}
      >
        <motion.div className="pointer-events-none absolute top-0 left-0" style={{ x: liveX }}>
          <div className="flex h-[25px] min-w-[54px] -translate-x-1/2 items-center justify-center rounded-[20px] bg-[#1D1D1F] px-[12px] font-runde text-[10px] font-medium leading-none tracking-[-0.02em] text-white">
            {label}
          </div>
        </motion.div>
        <div
          className="pointer-events-none absolute right-0 left-0"
          style={{ top: PILL_H + PILL_TICK_GAP, bottom: 0 }}
        >
          {Array.from({ length: TICK_COUNT }, (_, i) => (
            <div
              key={i}
              ref={(node) => {
                tickRefs.current[i] = node;
              }}
              className="absolute bottom-0 rounded-[1px]"
              style={{
                width: 1,
                height: TICK_H,
                backgroundColor: 'rgb(169, 169, 175)',
                transformOrigin: 'center bottom',
                transform: `translateX(${i * STEP}px) scaleY(0.15)`,
                opacity: 0.28,
              }}
            />
          ))}
          <motion.div
            className="pointer-events-none absolute bottom-0 w-[2px] bg-[#1D1D1F]"
            style={{
              x: liveX,
              left: -1,
              height: TICK_H,
            }}
          />
        </div>
      </div>
      <div
        className="relative flex items-start justify-between"
        style={{ width: TRACK + 2, height: 36, marginTop: 9 }}
      >
        {labels.map((name, i) => {
          const pressed = name === label;
          return (
            <button
              key={`${name}-${i}`}
              type="button"
              aria-pressed={pressed}
              aria-label={`Go to ${name}`}
              className={`whitespace-nowrap rounded-[5px] border-0 bg-transparent px-[6px] py-[10px] font-runde text-[11px] leading-none transition-colors ${
                pressed
                  ? 'text-[#242426]'
                  : 'text-[#8B8B90] hover:bg-[#F6F6F7] hover:text-[#333]'
              }`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onSeek?.(i / projects)}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
