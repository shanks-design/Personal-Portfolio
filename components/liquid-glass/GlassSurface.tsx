'use client';

/**
 * GlassSurface — the one primitive everything else composes from.
 *
 * There are two honest modes, and the distinction is the whole point:
 *
 *   1. REFRACT (real glass). You pass `refract` = a copy of the background you
 *      want to bend, as DOM you control (an <img>, a <div> with the same fill,
 *      a duplicate of the layer behind). The engine bends THAT copy with an SVG
 *      feDisplacementMap via `filter: url()`. Cross-browser, content on top
 *      stays crisp and interactive.
 *
 *   2. FROST (fallback). If you cannot supply a bendable copy — most commonly
 *      because the thing behind is an <iframe>, <video>, or cross-origin content
 *      whose pixels you cannot sample — there is no real refraction available in
 *      any browser. Pass `frost` to acknowledge this and get a tasteful frosted
 *      panel instead. Frost is a blur, not glass. Do not pretend otherwise.
 *
 * If you pass neither, you get frost plus a dev warning, because silently
 * emitting frost while believing it is glass is exactly the bug this replaces.
 */

import { CSSProperties, ReactNode, forwardRef, useRef } from 'react';
import { useGlassRefraction } from './useGlassRefraction';

type Tag = 'div' | 'button';

export interface GlassSurfaceProps {
  children?: ReactNode;

  /** A copy of the background to bend. Provide this for REAL refraction. Must be
   *  DOM you control in the same document (you cannot sample an iframe / video /
   *  cross-origin background). */
  refract?: ReactNode;

  /** Acknowledge that you are intentionally using the frosted fallback (e.g.
   *  because the background is an iframe/video and cannot be refracted). */
  frost?: boolean;

  /** Corner radius in px, or 'pill'. */
  radius?: number | 'pill';
  /** Bevel band as a fraction of min(w,h). Wider = the bend reaches further in. */
  depth?: number;
  /** Displacement strength in px moved at the rim. Keep LOW (4–10) for controls
   *  whose contents must stay readable; go higher (16–28) for decorative lenses. */
  scale?: number;
  /** Chromatic aberration amount, 0–1. */
  chroma?: number;
  /** Optional blur in px. For REAL glass leave this at 0. Only the frost fallback
   *  uses blur meaningfully. */
  blur?: number;
  /** Translucent tint over the surface. */
  tint?: string;
  /** Edge highlight strength, 0–1. This is a lot of what sells "glass" on small
   *  controls, so keep it present even when scale is low. */
  rim?: number;

  as?: Tag;
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T | null>).current = value;
}

export const GlassSurface = forwardRef<HTMLElement, GlassSurfaceProps>(function GlassSurface(
  {
    children,
    refract,
    frost = false,
    radius = 'pill',
    depth = 0.22,
    scale = 10,
    chroma = 0.2,
    blur = 0,
    tint = 'rgba(255,255,255,0.06)',
    rim = 0.8,
    as = 'div',
    onClick,
    ariaLabel,
    title,
    className,
    style,
  },
  externalRef,
) {
  const { ref, filterId, mapUrl, ready } = useGlassRefraction({ radius, depth });
  const warned = useRef(false);

  const usingRefraction = Boolean(refract);
  if (
    process.env.NODE_ENV !== 'production' &&
    !usingRefraction &&
    !frost &&
    !warned.current
  ) {
    warned.current = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[GlassSurface] No `refract` source provided, so this is FROST (a blur), not real glass. ' +
        'Pass `refract` with a bendable copy of the background for true refraction, ' +
        'or pass `frost` to acknowledge the fallback (e.g. over an iframe/video you cannot sample).',
    );
  }

  const borderRadius = radius === 'pill' ? 9999 : radius;
  const sG = scale;
  const sR = scale * (1 + 0.14 * chroma);
  const sB = scale * (1 - 0.14 * chroma);

  const Component = as as 'div';

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        ref.current = node;
        assignRef(externalRef, node);
      }}
      className={cx('glass-surface', className)}
      style={{ borderRadius, ...style }}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      {...(as === 'button' ? { type: 'button' as const } : {})}
    >
      {usingRefraction && ready && (
        <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter
              id={filterId}
              colorInterpolationFilters="sRGB"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feImage
                href={mapUrl}
                result="map"
                preserveAspectRatio="none"
                x="0"
                y="0"
                width="100%"
                height="100%"
              />
              <feDisplacementMap in="SourceGraphic" in2="map" scale={sG} xChannelSelector="R" yChannelSelector="G" result="dMain" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale={sR} xChannelSelector="R" yChannelSelector="G" result="dR" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale={sB} xChannelSelector="R" yChannelSelector="G" result="dB" />
              <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="cR" />
              <feColorMatrix in="dMain" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0 1" result="cG" />
              <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0 1" result="cB" />
              <feComposite in="cR" in2="cG" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="cRG" />
              <feComposite in="cRG" in2="cB" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="cRGB" />
              <feComposite in="cRGB" in2="dMain" operator="in" result="glass" />
              {blur > 0 && <feGaussianBlur in="glass" stdDeviation={blur} />}
            </filter>
          </defs>
        </svg>
      )}

      {usingRefraction ? (
        <div
          className="glass-layer glass-refract"
          style={{ filter: ready ? `url(#${filterId})` : undefined }}
        >
          <div style={{ position: 'absolute', inset: 0 }}>{refract}</div>
        </div>
      ) : (
        <div
          className="glass-layer glass-frost"
          style={{
            backdropFilter: `blur(${Math.max(2, blur || 6)}px) saturate(150%)`,
            WebkitBackdropFilter: `blur(${Math.max(2, blur || 6)}px) saturate(150%)`,
          }}
        />
      )}

      <div className="glass-layer" style={{ background: tint }} />

      <div
        className="glass-layer"
        style={{
          boxShadow: `inset 0 0 0 0.5px rgba(255,255,255,${0.35 * rim}), inset 0 1px 1px rgba(255,255,255,${0.28 * rim}), inset 0 -1px 2px rgba(0,0,0,${0.16 * rim})`,
        }}
      />

      <span className="glass-content">{children}</span>
    </Component>
  );
});
