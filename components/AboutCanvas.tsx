'use client';

import { motion } from 'framer-motion';
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
}

const polaroids: PolaroidItem[] = [
  { id: 'me', label: 'Me :)', image: 'https://picsum.photos/seed/me/220/260', initialX: 42, initialY: 8, rotation: -7, size: 'medium' },
  { id: 'climbing', label: 'Climbing', image: 'https://picsum.photos/seed/climb/220/260', initialX: 5, initialY: 32, rotation: 2, size: 'medium' },
  { id: 'travelling', label: 'Travelling', image: 'https://picsum.photos/seed/travel/220/260', initialX: 38, initialY: 35, rotation: -1.5, size: 'medium' },
  { id: 'cooking', label: 'Cooking', image: 'https://picsum.photos/seed/cook/220/260', initialX: 70, initialY: 60, rotation: 1.5, size: 'medium' },
  { id: 'grass', label: 'Touching grass', image: 'https://picsum.photos/seed/grass/220/260', initialX: 8, initialY: 62, rotation: 2.5, size: 'large' },
  { id: 'painting', label: 'Painting', image: 'https://picsum.photos/seed/paint/220/260', initialX: 72, initialY: 32, rotation: 1, size: 'large' },
  { id: 'art', label: 'Watching art', image: 'https://picsum.photos/seed/art/220/260', initialX: 40, initialY: 62, rotation: -2, size: 'small' },
];

const GAP_POLAROID_TO_TEXT_PX = 24;
const ME_POLAROID_VIEWPORT_CENTER_Y = 420 - POLAROID_SIZES.medium.height / 2 - GAP_POLAROID_TO_TEXT_PX;

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
  const paddingX = (dims.width - dims.imageWidth) / 2;
  const paddingTop = 8;
  const paddingBottom = dims.height - paddingTop - dims.imageHeight - 28;

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
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
          className="text-center text-gray-800 font-medium px-1"
          style={{
            fontFamily: 'var(--font-inter)',
            ...(item.size === 'small'
              ? { fontSize: '10.08px', paddingTop: 8, paddingBottom: 8, margin: 0 }
              : { fontSize: '14px', marginTop: 12 }),
          }}
        >
          {item.label}
        </p>
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

  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      style={{
        height: '1902px',
        marginTop: '120px',
        zIndex: 20,
        borderTopLeftRadius: '40px',
        borderTopRightRadius: '40px',
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
            top: mePolaroidPosition ? mePolaroidPosition.y : 420 - POLAROID_SIZES.medium.height - GAP_POLAROID_TO_TEXT_PX,
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
            className="rounded-lg origin-center"
            style={{
              width: POLAROID_SIZES.medium.width,
              height: POLAROID_SIZES.medium.height,
              padding: `8px ${(POLAROID_SIZES.medium.width - POLAROID_SIZES.medium.imageWidth) / 2}px ${POLAROID_SIZES.medium.height - 8 - POLAROID_SIZES.medium.imageHeight - 28}px`,
              backgroundColor: '#F2F1ED',
              border: '1px solid #EBEAE6',
              transform: 'rotate(-7deg)',
            }}
          >
            <div
              className="overflow-hidden bg-gray-100 rounded-md mx-auto"
              style={{ width: POLAROID_SIZES.medium.imageWidth, height: POLAROID_SIZES.medium.imageHeight }}
            >
              <img
                src="https://picsum.photos/seed/me/220/260"
                alt="Me"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <p className="text-center text-gray-800 text-sm font-medium mt-3 px-1" style={{ fontFamily: 'var(--font-inter)' }}>
              Me :)
            </p>
          </div>
        </motion.div>

        {/* Static text: viewport-relative so it's never cut off, 420px from top */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute text-gray-800 text-center max-w-[480px]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '34px',
              lineHeight: '56px',
              letterSpacing: '-0.04em',
              left: '50%',
              top: '420px',
              transform: 'translate(-50%, 0)',
            }}
          >
            I find joy in <strong>crafting</strong> experiences that go beyond mere usability, creating <strong>connections</strong> between <strong>people</strong> and bringing ☀️ <strong>delight</strong> to the often dull digital world.
          </div>
          <div
            className="absolute text-gray-800 text-center max-w-[480px]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '34px',
              lineHeight: '56px',
              letterSpacing: '-0.04em',
              left: '50%',
              top: '65%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            When I am <strong>not designing</strong> I like to indulge in other forms of creation like cooking, writing, and ⛏️ <strong>Minecrafting</strong>
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

              {/* Polaroids: draggable on canvas */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 pointer-events-auto">
                  {polaroids.filter((item) => item.id !== 'me').map((item) => (
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
