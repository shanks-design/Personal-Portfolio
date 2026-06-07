'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';

type PolaroidSize = 'small' | 'medium' | 'large';

const POLAROID_SIZES: Record<
  PolaroidSize,
  { width: number; height: number; imageWidth: number; imageHeight: number }
> = {
  small: { width: 165, height: 204, imageWidth: 150, imageHeight: 162 },
  medium: { width: 217, height: 268, imageWidth: 197, imageHeight: 213 },
  large: { width: 300, height: 370, imageWidth: 271, imageHeight: 293 },
};

interface PolaroidConfig {
  id: string;
  label: string;
  image: string;
  initialLeft: string;
  initialTop: string;
  rotation: number;
  size: PolaroidSize;
  fullPolaroidImage?: boolean;
}

const ALL_POLAROIDS: PolaroidConfig[] = [
  { id: 'me', label: 'Me :)', image: '/me-photo-polo.png', initialLeft: '50%', initialTop: '21.1%', rotation: 7, size: 'medium', fullPolaroidImage: true },
  { id: 'climbing', label: 'Climbing', image: '/Climbing-photo-polo.png', initialLeft: '23.3%', initialTop: '31.4%', rotation: 30, size: 'medium', fullPolaroidImage: true },
  { id: 'travelling', label: 'Travelling', image: '/travelling-photo-polo.png', initialLeft: '51.4%', initialTop: '68.8%', rotation: -5, size: 'medium', fullPolaroidImage: true },
  { id: 'painting', label: 'Painting', image: '/Painting-photo-polo.png', initialLeft: '80%', initialTop: '30.8%', rotation: 10, size: 'large', fullPolaroidImage: true },
  { id: 'left-of-art', label: 'Touching grass', image: '/Grass-photo-polo.png', initialLeft: '27%', initialTop: '74.0%', rotation: -12, size: 'large', fullPolaroidImage: true },
  { id: 'cooking', label: 'Cooking', image: '/Cooking-photo-polo.png', initialLeft: '75.8%', initialTop: '66.4%', rotation: 18, size: 'medium', fullPolaroidImage: true },
];

function ViewportPolaroid({
  config,
  containerRef,
  zIndex,
  onGrab,
}: {
  config: PolaroidConfig;
  containerRef: React.RefObject<HTMLDivElement | null>;
  zIndex: number;
  onGrab: () => void;
}) {
  const [currentZ, setCurrentZ] = useState(zIndex);
  const dims = POLAROID_SIZES[config.size];

  useEffect(() => {
    setCurrentZ(zIndex);
  }, [zIndex]);

  const paddingX = (dims.width - dims.imageWidth) / 2 - 2;
  const paddingTop = config.size === 'large' ? paddingX : 6;
  const labelSpace = config.size === 'large' ? 54 : 28;
  const paddingBottom = dims.height - paddingTop - dims.imageHeight - labelSpace;

  const renderContent = () => {
    if (config.fullPolaroidImage) {
      return (
        <div
          className="rounded-lg origin-center overflow-hidden"
          style={{ width: dims.width, height: dims.height }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.image}
            alt={config.label}
            width={dims.width}
            height={dims.height}
            className="w-full h-full object-cover block"
            draggable={false}
          />
        </div>
      );
    }

    return (
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.image}
            alt={config.label}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <p
          className="text-center text-gray-800 font-bold px-1"
          style={{
            fontFamily: 'var(--font-caveat)',
            fontWeight: 700,
            ...(config.size === 'small'
              ? { fontSize: '17px', paddingTop: 3, paddingBottom: 8, margin: 0 }
              : config.size === 'large'
                ? { fontSize: '31px', lineHeight: '36px', marginTop: 12 }
                : { fontSize: '24px', paddingTop: 3, paddingBottom: 12, margin: 0 }),
          }}
        >
          {config.label}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        left: config.initialLeft,
        top: config.initialTop,
        x: '-50%',
        y: '-50%',
        zIndex: currentZ,
        rotate: config.rotation,
      }}
      drag
      dragMomentum={false}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
      dragConstraints={containerRef}
      onDragStart={() => {
        onGrab();
      }}
      whileDrag={{ scale: 1.04, rotate: config.rotation + 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {renderContent()}
    </motion.div>
  );
}

export default function AboutCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const zCounterRef = useRef(10);
  const [zIndices, setZIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ALL_POLAROIDS.forEach((p, i) => {
      initial[p.id] = i + 1;
    });
    return initial;
  });

  const bringToFront = useCallback((id: string) => {
    zCounterRef.current += 1;
    setZIndices((prev) => ({ ...prev, [id]: zCounterRef.current }));
  }, []);

  return (
    <section
      className="relative w-full bg-white overflow-hidden rounded-t-[40px]"
      style={{
        height: '1327px',
        marginTop: '0px',
        zIndex: 20,
      }}
    >
      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden"
        style={{ left: '50%', marginLeft: '-50vw', width: '100vw' }}
      >
        {/* Static text blocks */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          aria-hidden
        >
          <div
            className="hidden absolute text-gray-800 text-center max-w-[660px]"
            style={{
              fontFamily: 'OpenRunde, Inter, sans-serif',
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
              fontFamily: 'OpenRunde, Inter, sans-serif',
              fontSize: '34px',
              lineHeight: '56px',
              letterSpacing: '-0.03em',
              fontWeight: 400,
              paddingTop: '10px',
              left: '50%',
              top: '44.8%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            When I am not designing or doom scrolling, I like playing <span className="font-semibold">tennis,</span> Pokémon, hiking, cooking and <span className="font-semibold">brewing coffee</span>
          </div>
        </div>

        {/* All polaroids — unified viewport layer */}
        {ALL_POLAROIDS.map((config) => (
          <ViewportPolaroid
            key={config.id}
            config={config}
            containerRef={viewportRef}
            zIndex={zIndices[config.id] ?? 1}
            onGrab={() => bringToFront(config.id)}
          />
        ))}
      </div>
    </section>
  );
}
