'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';
import { GlassButton } from '@/components/liquid-glass';

const CANVAS_SRC = '/pb-canvas/index.html';

export default function PokemonCanvasWindow() {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      <iframe
        title="Pokémon cards canvas"
        src={CANVAS_SRC}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', border: 0, display: 'block' }}
      />

      <GlassButton
        frost
        radius="pill"
        ariaLabel="Expand canvas"
        title="Expand"
        onClick={() => setExpanded(true)}
        style={{ position: 'absolute', right: 16, top: 16, width: 40, height: 40, zIndex: 10 }}
        contentClassName="text-white/90"
      >
        <Maximize2 size={18} strokeWidth={2} aria-hidden />
      </GlassButton>

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
                background: '#07070b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 40px 120px -20px rgba(0, 0, 0, 0.8)',
              }}
            >
              <iframe
                title="Pokémon cards canvas (fullscreen)"
                src={CANVAS_SRC}
                style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', border: 0, display: 'block' }}
              />

              <GlassButton
                frost
                radius="pill"
                ariaLabel="Close fullscreen"
                title="Close (Esc)"
                onClick={() => setExpanded(false)}
                style={{ position: 'absolute', right: 20, top: 20, width: 44, height: 44, zIndex: 10 }}
                contentClassName="text-white/90"
              >
                <X size={20} strokeWidth={2} aria-hidden />
              </GlassButton>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
