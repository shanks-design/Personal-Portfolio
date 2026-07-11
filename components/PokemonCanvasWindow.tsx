'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Navigation, X } from 'lucide-react';
import { GlassOverIframeButton } from '@/components/liquid-glass';
import { useGlassChromeDials } from '@/components/liquid-glass/useGlassChromeDials';
import { Pointer } from '@/components/ui/pointer';

const CANVAS_SRC = '/pb-canvas/index.html?chrome=0';

function EmojiPointer() {
  return (
    <Pointer>
      <span className="text-2xl">👆</span>
    </Pointer>
  );
}

function postHome(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage({ type: 'pb-canvas:home' }, '*');
}

function CanvasChrome({
  iframeRef,
  onExpand,
  onClose,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onExpand?: () => void;
  onClose?: () => void;
}) {
  const dials = useGlassChromeDials();
  const goHome = useCallback(() => {
    postHome(iframeRef.current);
  }, [iframeRef]);

  const width = dials.size.width;
  const height = dials.size.height;
  const radius = dials.size.pill ? ('pill' as const) : dials.size.borderRadius;
  const glassProps = {
    width,
    height,
    radius,
    depth: dials.refraction.depth,
    strength: dials.refraction.strength,
    curvature: dials.refraction.curvature,
    splay: dials.refraction.splay,
    chroma: dials.refraction.chroma,
    blur: dials.refraction.blur,
    rim: dials.surface.rim,
    glow: dials.surface.glow,
    specularAngle: dials.surface.specularAngle,
    tint: `rgba(0,0,0,${dials.surface.tintOpacity})`,
    borderWidth: dials.border.width,
    borderAngle: dials.border.angle,
    borderColorStart: dials.border.colorStart,
    borderColorMiddle: dials.border.colorMiddle,
    borderColorEnd: dials.border.colorEnd,
    borderOpacityStart: dials.border.opacityStart,
    borderOpacityMiddle: dials.border.opacityMiddle,
    borderOpacityEnd: dials.border.opacityEnd,
    borderMiddleStop: dials.border.middleStop,
  };
  const iconSize = Math.round(Math.min(width, height) * 0.45);

  return (
    <>
      {onExpand && (
        <GlassOverIframeButton
          iframeRef={iframeRef}
          ariaLabel="Expand canvas"
          title="Expand"
          onClick={onExpand}
          style={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}
          {...glassProps}
        >
          <Maximize2 size={iconSize} strokeWidth={2} aria-hidden />
        </GlassOverIframeButton>
      )}

      {onClose && (
        <GlassOverIframeButton
          iframeRef={iframeRef}
          ariaLabel="Close fullscreen"
          title="Close (Esc)"
          onClick={onClose}
          style={{ position: 'absolute', right: 20, top: 20, zIndex: 10 }}
          {...glassProps}
        >
          <X size={iconSize} strokeWidth={2} aria-hidden />
        </GlassOverIframeButton>
      )}

      <GlassOverIframeButton
        iframeRef={iframeRef}
        ariaLabel="Reset view"
        title="Reset view (0)"
        onClick={goHome}
        style={{
          position: 'absolute',
          right: onClose ? 20 : 16,
          bottom: onClose ? 20 : 16,
          zIndex: 10,
        }}
        {...glassProps}
      >
        <Navigation
          size={iconSize}
          strokeWidth={2}
          aria-hidden
          // Optical center: arrow mass sits toward the tip (top-right)
          style={{
            display: 'block',
            transform: `translate(${-iconSize * 0.06}px, ${iconSize * 0.06}px)`,
          }}
        />
      </GlassOverIframeButton>
    </>
  );
}

export default function PokemonCanvasWindow() {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inlineIframeRef = useRef<HTMLIFrameElement | null>(null);
  const expandedIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      <EmojiPointer />

      <iframe
        ref={inlineIframeRef}
        title="Pokémon cards canvas"
        src={CANVAS_SRC}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', border: 0, display: 'block' }}
      />

      <CanvasChrome
        iframeRef={inlineIframeRef}
        onExpand={() => setExpanded(true)}
      />

      {mounted && expanded &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pokémon cards canvas"
            onClick={() => setExpanded(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3vmin',
              background: 'rgba(5, 5, 7, 0.72)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '94vw',
                height: '92vh',
                borderRadius: 24,
                overflow: 'hidden',
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 40px 120px -20px rgba(0, 0, 0, 0.8)',
              }}
            >
              <EmojiPointer />

              <iframe
                ref={expandedIframeRef}
                title="Pokémon cards canvas (fullscreen)"
                src={CANVAS_SRC}
                style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', border: 0, display: 'block' }}
              />

              <CanvasChrome
                iframeRef={expandedIframeRef}
                onClose={() => setExpanded(false)}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
