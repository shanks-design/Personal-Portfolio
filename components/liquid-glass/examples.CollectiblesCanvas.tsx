'use client';

/**
 * CollectiblesCanvas — corrected glass buttons.
 *
 * The original bug: LiquidGlass used `backdrop-filter: blur(18px) ... url(#id)`
 * over an <iframe>. On Safari the url() displacement is ignored, so only the
 * blur ran = smudge, and an iframe's pixels cannot be sampled for refraction
 * anyway. There was no real glass happening.
 *
 * Two honest paths are shown below. Pick based on whether you can put the
 * background in the same document.
 */

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { GlassButton, GlassPill } from '@/components/liquid-glass';

const EMBED_SRC = '/pb-canvas/index.html?embed=1';

/**
 * PATH A — the pragmatic fix for RIGHT NOW, while the background stays an iframe.
 * You cannot refract an iframe, so use honest frost: pass `frost`. It is a
 * tasteful blur + tint + rim, not a claim of refraction. Over the near-black
 * Pitch Black screen it reads clean; over busy art it will still soften what is
 * behind (that is what frost does), but it will not look like a broken smudge.
 */
export function CollectiblesCanvasFrost() {
  const [, setExpanded] = useState(false);
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      <iframe title="Pokemon collectibles canvas preview" src={EMBED_SRC} style={{ height: '100%', width: '100%', border: 0 }} loading="lazy" />

      <GlassButton
        frost
        radius="pill"
        ariaLabel="Expand canvas"
        onClick={() => setExpanded(true)}
        className="glass-expand"
        style={{ position: 'absolute', right: 16, top: 16, width: 40, height: 40, zIndex: 10 }}
        contentClassName="text-white/90"
      >
        <Maximize2 size={18} strokeWidth={2} aria-hidden />
      </GlassButton>

      <div style={{ position: 'absolute', insetInline: 0, bottom: 16, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <GlassPill frost contentClassName="text-[14px] font-medium text-white/90">
          My Pokémon Cards
        </GlassPill>
      </div>
    </div>
  );
}

/**
 * PATH B — REAL refraction. Render the same background as DOM in this document
 * (behind the glass) instead of only inside the iframe, then hand each glass a
 * copy of it via `refract`. Now the lens bends live pixels and it works in
 * Safari. `bgNode` here is whatever your background layer is — e.g. the same
 * card artwork/canvas rendered as React rather than embedded.
 */
export function CollectiblesCanvasRefract({ bgNode }: { bgNode: React.ReactNode }) {
  const [, setExpanded] = useState(false);
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* The real background, in-document so it can be sampled. */}
      <div style={{ position: 'absolute', inset: 0 }}>{bgNode}</div>

      <GlassButton
        radius="pill"
        ariaLabel="Expand canvas"
        onClick={() => setExpanded(true)}
        style={{ position: 'absolute', right: 16, top: 16, width: 40, height: 40, zIndex: 10 }}
        contentClassName="text-white/90"
        // A copy of the background, counter-positioned under the button.
        refract={<div style={{ position: 'absolute', right: 16, top: 16, width: 40, height: 40, transform: 'translate(16px,-16px)' }}>{bgNode}</div>}
      >
        <Maximize2 size={18} strokeWidth={2} aria-hidden />
      </GlassButton>
    </div>
  );
}
