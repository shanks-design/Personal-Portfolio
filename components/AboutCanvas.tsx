'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';

const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 3000;

type PolaroidSize = 'small' | 'medium' | 'large';

const POLAROID_SIZES: Record<
  PolaroidSize,
  { width: number; height: number; imageWidth: number; imageHeight: number }
> = {
  small: { width: 165, height: 204, imageWidth: 150, imageHeight: 162 },
  medium: { width: 217, height: 268, imageWidth: 197, imageHeight: 213 },
  large: { width: 300, height: 370, imageWidth: 271, imageHeight: 293 },
};

const POLAROID_HALF_WIDTH = POLAROID_SIZES.large.width / 2;
const POLAROID_HALF_HEIGHT = POLAROID_SIZES.large.height / 2;

interface PolaroidItem {
  id: string;
  label: string;
  image: string;
  initialX: number;
  initialY: number;
  rotation: number;
  size: PolaroidSize;
  fullPolaroidImage?: boolean;
}

const polaroids: PolaroidItem[] = [
  // NOTE: "me" is rendered in the viewport layer, not on the canvas,
  // but we keep this entry for completeness / potential future use.
  { id: 'me', label: 'Me :)', image: 'https://picsum.photos/seed/me/220/260', initialX: 42, initialY: 8, rotation: -7, size: 'medium' },

  // Default layout tuned to match reference composition and angles
  // Climbing: left of second text block
  { id: 'climbing', label: 'Climbing', image: '/Climbing-photo-polo.png', initialX: 12, initialY: 62, rotation: -12, size: 'medium', fullPolaroidImage: true },
  { id: 'travelling', label: 'Travelling', image: 'https://picsum.photos/seed/travel/220/260', initialX: 50, initialY: 38, rotation: -3, size: 'medium' },
  { id: 'cooking', label: 'Cooking', image: '/Cooking-photo-polo.png', initialX: 59.75, initialY: 68.5, rotation: 20, size: 'medium', fullPolaroidImage: true },

  { id: 'painting', label: 'Painting', image: '/Painting-photo-polo.png', initialX: 82, initialY: 40, rotation: 7, size: 'large', fullPolaroidImage: true },

  { id: 'art', label: 'Watching art', image: '/Art-photo-polo.png', initialX: 50, initialY: 68, rotation: 13, size: 'small', fullPolaroidImage: true },
  { id: 'left-of-art', label: 'Touching grass', image: '/Grass-photo-polo.png', initialX: 40, initialY: 71, rotation: -8, size: 'large', fullPolaroidImage: true },
];

const GAP_POLAROID_TO_TEXT_PX = 24;
const ME_POLAROID_VIEWPORT_CENTER_Y = 344 - POLAROID_SIZES.medium.height / 2 - GAP_POLAROID_TO_TEXT_PX;
// Default vertical placement for Travelling: 743px from top of the section.
const TRAVELLING_DEFAULT_TOP = 743;

function DraggablePolaroid({
  item,
  viewportBoundsRef,
  pan,
  viewportSize,
  initialPositionOverride,
}: {
  item: PolaroidItem;
  viewportBoundsRef: React.RefObject<HTMLDivElement | null>;
  pan: { x: number; y: number };
  viewportSize: { width: number; height: number } | null;
  initialPositionOverride?: { x: number; y: number };
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (item.id === 'me') {
      if (initialPositionOverride !== undefined) {
        setPosition(initialPositionOverride);
        hasInitialized.current = true;
      } else if (!hasInitialized.current) {
        setPosition({
          x: CANVAS_WIDTH / 2,
          y: 1000,
        });
        hasInitialized.current = true;
      }
    } else {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      setPosition({
        x: (item.initialX / 100) * CANVAS_WIDTH,
        y: (item.initialY / 100) * CANVAS_HEIGHT,
      });
    }
  }, [item.id, item.initialX, item.initialY, initialPositionOverride]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number; y: number } }) => {
      if (!viewportSize) return;
      setPosition((prev) => {
        if (!prev) return prev;
        const rawX = prev.x + info.offset.x;
        const rawY = prev.y + info.offset.y;
        const minX = -pan.x + POLAROID_HALF_WIDTH;
        const maxX = -pan.x + viewportSize.width - POLAROID_HALF_WIDTH;
        const minY = -pan.y + POLAROID_HALF_HEIGHT;
        const maxY = -pan.y + viewportSize.height - POLAROID_HALF_HEIGHT;
        return {
          x: Math.max(minX, Math.min(maxX, rawX)),
          y: Math.max(minY, Math.min(maxY, rawY)),
        };
      });
    },
    [pan.x, pan.y, viewportSize],
  );

  if (!position) return null;

  const dims = POLAROID_SIZES[item.size];
  const paddingX = (dims.width - dims.imageWidth) / 2 - 2;
  const paddingTop = item.size === 'large' ? paddingX : 6;
  const labelSpace = item.size === 'large' ? 54 : 28;
  const paddingBottom = dims.height - paddingTop - dims.imageHeight - labelSpace;

  if (item.fullPolaroidImage) {
    return (
      <motion.div
        className="absolute cursor-grab active:cursor-grabbing touch-none select-none"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={viewportBoundsRef}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => {
          handleDragEnd(e, info);
          setIsDragging(false);
        }}
        whileDrag={{ scale: 1.02, zIndex: 50 }}
        initial={false}
      >
        <div style={{ transform: `rotate(${item.rotation}deg)` }}>
          <div
            className="rounded-lg origin-center overflow-hidden"
            style={{ width: dims.width, height: dims.height }}
          >
            <img
              src={item.image}
              alt={item.label}
              width={dims.width}
              height={dims.height}
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%)`,
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={viewportBoundsRef}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        handleDragEnd(e, info);
        setIsDragging(false);
      }}
      whileDrag={{ scale: 1.02, zIndex: 50 }}
      initial={false}
    >
      <div
        style={{ transform: `rotate(${item.rotation}deg)` }}
      >
        <div
          className="rounded-lg"
          style={{
          width: dims.width,
          height: dims.height,
          padding: `${paddingTop}px ${paddingX}px ${paddingBottom}px`,
          backgroundColor: '#F2F1ED',
          border: '1px solid #EBEAE6',
        }}
      >
        <div
          className="overflow-hidden bg-gray-100 rounded-md"
          style={{ width: dims.imageWidth, height: dims.imageHeight, margin: '0 auto' }}
        >
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <p
          className="text-center text-gray-800 font-bold px-1"
          style={{
            fontFamily: 'var(--font-caveat)',
            fontWeight: 700,
            ...(item.size === 'small'
              ? { fontSize: '17px', paddingTop: 3, paddingBottom: 8, margin: 0 }
              : item.size === 'large'
                ? { fontSize: '31px', lineHeight: '36px', marginTop: 12 }
                : { fontSize: '24px', paddingTop: 3, paddingBottom: 12, margin: 0 }),
          }}
        >
          {item.label}
        </p>
      </div>
      </div>
    </motion.div>
  );
}

export default function AboutCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportBoundsRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const [mePolaroidPosition, setMePolaroidPosition] = useState<{ x: number; y: number } | null>(null);
  const mePolaroidRef = useRef<HTMLDivElement>(null);
  const [travellingPolaroidPosition, setTravellingPolaroidPosition] = useState<{ x: number; y: number } | null>(null);
  const travellingPolaroidRef = useRef<HTMLDivElement>(null);
  const [climbingPolaroidPosition, setClimbingPolaroidPosition] = useState<{ x: number; y: number } | null>(null);
  const climbingPolaroidRef = useRef<HTMLDivElement>(null);
  const [paintingPolaroidPosition, setPaintingPolaroidPosition] = useState<{ x: number; y: number } | null>(null);
  const paintingPolaroidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      setViewportSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!viewportSize) return;
    setPan({
      x: viewportSize.width / 2 - CANVAS_WIDTH / 2,
      y: viewportSize.height / 2 - CANVAS_HEIGHT / 2,
    });
  }, [viewportSize?.width, viewportSize?.height]);

  const handlePanStart = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).getAttribute('data-pan-layer') !== 'true') return;
    isPanningRef.current = true;
    setIsPanning(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePanMove = useCallback((e: React.PointerEvent) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const handlePanEnd = useCallback((e: React.PointerEvent) => {
    isPanningRef.current = false;
    setIsPanning(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  const handleMePolaroidDragEnd = useCallback(() => {
    const el = mePolaroidRef.current;
    const viewportEl = viewportRef.current;
    if (!el || !viewportEl || !viewportSize) return;
    const rect = el.getBoundingClientRect();
    const viewportRect = viewportEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - viewportRect.left;
    const centerY = rect.top + rect.height / 2 - viewportRect.top;
    const halfW = POLAROID_SIZES.medium.width / 2;
    const halfH = POLAROID_SIZES.medium.height / 2;
    setMePolaroidPosition({
      x: Math.max(halfW, Math.min(viewportSize.width - halfW, centerX)),
      y: Math.max(halfH, Math.min(viewportSize.height - halfH, centerY)),
    });
  }, [viewportSize]);

  const handleTravellingPolaroidDragEnd = useCallback(() => {
    const el = travellingPolaroidRef.current;
    const viewportEl = viewportRef.current;
    if (!el || !viewportEl || !viewportSize) return;
    const rect = el.getBoundingClientRect();
    const viewportRect = viewportEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - viewportRect.left;
    const centerY = rect.top + rect.height / 2 - viewportRect.top;
    const halfW = POLAROID_SIZES.medium.width / 2;
    const halfH = POLAROID_SIZES.medium.height / 2;
    setTravellingPolaroidPosition({
      x: Math.max(halfW, Math.min(viewportSize.width - halfW, centerX)),
      y: Math.max(halfH, Math.min(viewportSize.height - halfH, centerY)),
    });
  }, [viewportSize]);

  const handleClimbingPolaroidDragEnd = useCallback(() => {
    const el = climbingPolaroidRef.current;
    const viewportEl = viewportRef.current;
    if (!el || !viewportEl || !viewportSize) return;
    const rect = el.getBoundingClientRect();
    const viewportRect = viewportEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - viewportRect.left;
    const centerY = rect.top + rect.height / 2 - viewportRect.top;
    const halfW = POLAROID_SIZES.medium.width / 2;
    const halfH = POLAROID_SIZES.medium.height / 2;
    setClimbingPolaroidPosition({
      x: Math.max(halfW, Math.min(viewportSize.width - halfW, centerX)),
      y: Math.max(halfH, Math.min(viewportSize.height - halfH, centerY)),
    });
  }, [viewportSize]);

  const handlePaintingPolaroidDragEnd = useCallback(() => {
    const el = paintingPolaroidRef.current;
    const viewportEl = viewportRef.current;
    if (!el || !viewportEl || !viewportSize) return;
    const rect = el.getBoundingClientRect();
    const viewportRect = viewportEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - viewportRect.left;
    const centerY = rect.top + rect.height / 2 - viewportRect.top;
    const halfW = POLAROID_SIZES.large.width / 2;
    const halfH = POLAROID_SIZES.large.height / 2;
    setPaintingPolaroidPosition({
      x: Math.max(halfW, Math.min(viewportSize.width - halfW, centerX)),
      y: Math.max(halfH, Math.min(viewportSize.height - halfH, centerY)),
    });
  }, [viewportSize]);

  return (
    <section
      className="relative w-full bg-white overflow-hidden rounded-t-[40px]"
      style={{
        height: '1902px',
        marginTop: '120px',
        zIndex: 20,
      }}
    >
      {/* Viewport: visible window, overflow hidden (Excalidraw-style) */}
      <div
        ref={viewportRef}
        className="absolute inset-0 w-screen overflow-hidden"
        style={{ left: '50%', marginLeft: '-50vw', width: '100vw' }}
      >
        {/* "Me :)" polaroid: draggable, default above first text on first load/refresh, always -7deg tilt */}
        <motion.div
          ref={mePolaroidRef}
          className="absolute z-[6] cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
          style={{
            left: mePolaroidPosition ? mePolaroidPosition.x : '50%',
            top: mePolaroidPosition ? mePolaroidPosition.y : 344 - POLAROID_SIZES.medium.height - GAP_POLAROID_TO_TEXT_PX,
            width: POLAROID_SIZES.medium.width,
            height: POLAROID_SIZES.medium.height,
            transform: mePolaroidPosition
              ? 'translate(-50%, -50%)'
              : 'translate(-50%, 0)',
          }}
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={viewportRef}
          onDragEnd={handleMePolaroidDragEnd}
          whileDrag={{ scale: 1.02, zIndex: 50 }}
        >
          <div
            className="rounded-lg origin-center overflow-hidden"
            style={{
              width: POLAROID_SIZES.medium.width,
              height: POLAROID_SIZES.medium.height,
              transform: 'rotate(7deg)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/me-photo-polo.png"
              alt="Me"
              width={POLAROID_SIZES.medium.width}
              height={POLAROID_SIZES.medium.height}
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* "Travelling" polaroid: draggable, centered below first text on first load/refresh */}
        <motion.div
          ref={travellingPolaroidRef}
          className="absolute z-[6] cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
          style={{
            left: travellingPolaroidPosition ? travellingPolaroidPosition.x : '50%',
            top: travellingPolaroidPosition ? travellingPolaroidPosition.y : TRAVELLING_DEFAULT_TOP,
            width: POLAROID_SIZES.medium.width,
            height: POLAROID_SIZES.medium.height,
            transform: travellingPolaroidPosition
              ? 'translate(-50%, -50%)'
              : 'translate(-50%, 0)',
          }}
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={viewportRef}
          onDragEnd={handleTravellingPolaroidDragEnd}
          whileDrag={{ scale: 1.02, zIndex: 50 }}
        >
          <div
            className="rounded-lg origin-center overflow-hidden"
            style={{
              width: POLAROID_SIZES.medium.width,
              height: POLAROID_SIZES.medium.height,
              transform: 'rotate(-6.5deg)',
            }}
          >
            <img
              src="/travelling-photo-polo.png"
              alt="Travelling"
              width={POLAROID_SIZES.medium.width}
              height={POLAROID_SIZES.medium.height}
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* "Climbing" polaroid: draggable, left of second text on first load/refresh */}
        <motion.div
          ref={climbingPolaroidRef}
          className="absolute z-[6] cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
          style={{
            left: climbingPolaroidPosition ? climbingPolaroidPosition.x : '16%',
            top: climbingPolaroidPosition ? climbingPolaroidPosition.y : '50%', // 5% higher than original 55%
            width: POLAROID_SIZES.medium.width,
            height: POLAROID_SIZES.medium.height,
            transform: climbingPolaroidPosition
              ? 'translate(-50%, -50%)'
              : 'translate(-50%, 0)',
          }}
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={viewportRef}
          onDragEnd={handleClimbingPolaroidDragEnd}
          whileDrag={{ scale: 1.02, zIndex: 50 }}
        >
          <div
            className="rounded-lg origin-center overflow-hidden"
            style={{
              width: POLAROID_SIZES.medium.width,
              height: POLAROID_SIZES.medium.height,
              transform: 'rotate(25deg)',
            }}
          >
            <img
              src="/Climbing-photo-polo.png"
              alt="Climbing"
              width={POLAROID_SIZES.medium.width}
              height={POLAROID_SIZES.medium.height}
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* "Painting" polaroid: draggable, right of second text on first load/refresh */}
        <motion.div
          ref={paintingPolaroidRef}
          className="absolute z-[6] cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
          style={{
            left: paintingPolaroidPosition ? paintingPolaroidPosition.x : '84%',
            top: paintingPolaroidPosition ? paintingPolaroidPosition.y : '44.5%',
            width: POLAROID_SIZES.large.width,
            height: POLAROID_SIZES.large.height,
            transform: paintingPolaroidPosition
              ? 'translate(-50%, -50%)'
              : 'translate(-50%, 0)',
          }}
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={viewportRef}
          onDragEnd={handlePaintingPolaroidDragEnd}
          whileDrag={{ scale: 1.02, zIndex: 50 }}
        >
          <div
            className="rounded-lg origin-center overflow-hidden"
            style={{
              width: POLAROID_SIZES.large.width,
              height: POLAROID_SIZES.large.height,
              transform: 'rotate(7deg)',
            }}
          >
            <img
              src="/Painting-photo-polo.png"
              alt="Painting"
              width={POLAROID_SIZES.large.width}
              height={POLAROID_SIZES.large.height}
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* Static text: viewport-relative so it's never cut off, 344px from top */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute text-gray-800 text-center max-w-[660px]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '34px',
              lineHeight: '56px',
              letterSpacing: '-0.03em',
              fontWeight: 400,
              paddingTop: '10px',
              paddingBottom: '48px',
              left: '50%',
              top: '344px',
              transform: 'translate(-50%, 0)',
            }}
          >
            I enjoy designing interfaces that feel <span className="font-semibold">conversational,</span> turning complexity into clarity while balancing <span className="font-semibold">usability</span> with thoughtful{' '}
            <Image src="/sparkle.png" alt="" width={32} height={32} className="inline-block align-middle" style={{ verticalAlign: 'middle', marginRight: '-2px' }} /> craft
          </div>
          <div
            className="absolute text-gray-800 text-center max-w-[480px]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '34px',
              lineHeight: '56px',
              letterSpacing: '-0.03em',
              fontWeight: 400,
              paddingTop: '10px',
              left: '50%',
              top: '62%', // ~20% less spacing vs previous 65%
              transform: 'translate(-50%, -50%)',
            }}
          >
            When I am not designing or doom scrolling, I like playing <span className="font-semibold">tennis,</span> Pokémon, hiking, cooking and <span className="font-semibold">brewing coffee</span>
          </div>
        </div>

        {/* Camera: pan only (fixed zoom) */}
        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* Large canvas (infinite-canvas feel like Excalidraw) */}
          <div
            ref={canvasRef}
            className="relative"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          >
            {/* Viewport bounds: polaroids constrained to this box (smooth edges, no going off) */}
            {viewportSize && (
              <div
                ref={viewportBoundsRef}
                className="absolute z-0 pointer-events-none"
                style={{
                  left: -pan.x + POLAROID_HALF_WIDTH,
                  top: -pan.y + POLAROID_HALF_HEIGHT,
                  width: viewportSize.width - POLAROID_HALF_WIDTH * 2,
                  height: viewportSize.height - POLAROID_HALF_HEIGHT * 2,
                }}
                aria-hidden
              />
            )}

            {/* Pan layer: drag empty space to pan */}
            <div
              data-pan-layer="true"
              className={`absolute inset-0 z-0 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
              onPointerDown={handlePanStart}
              onPointerMove={handlePanMove}
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
              onPointerCancel={handlePanEnd}
            />

              {/* Polaroids: draggable on canvas (excluding viewport-layer Me :), Travelling, Painting, Climbing) */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 pointer-events-auto">
                  {polaroids
                    .filter(
                      (item) =>
                        item.id !== 'me' &&
                        item.id !== 'travelling' &&
                        item.id !== 'painting' &&
                        item.id !== 'climbing',
                    )
                    .map((item) => (
                    <DraggablePolaroid
                      key={item.id}
                      item={item}
                      viewportBoundsRef={viewportBoundsRef}
                      pan={pan}
                      viewportSize={viewportSize}
                      initialPositionOverride={
                        item.id === 'me' && viewportSize
                          ? {
                              x: 2000,
                              y: ME_POLAROID_VIEWPORT_CENTER_Y - (viewportSize.height / 2 - CANVAS_HEIGHT / 2),
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
