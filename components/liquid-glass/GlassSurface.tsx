'use client';

/**
 * GlassSurface — the one primitive everything else composes from.
 *
 * Two honest modes:
 *   1. REFRACT — pass `refract` (DOM copy of the backdrop). Real bend via SVG
 *      feDisplacementMap. Cross-browser; content on top stays crisp.
 *   2. FROST — pass `frost` when you cannot sample the backdrop (iframe/video).
 *      Tuned blur + tint + rim. Not glass.
 */

import { CSSProperties, ReactNode, forwardRef, useRef } from 'react';
import { useGlassRefraction } from './useGlassRefraction';

type Tag = 'div' | 'button';

export interface GlassSurfaceProps {
  children?: ReactNode;

  /** A copy of the background to bend. Provide this for REAL refraction. */
  refract?: ReactNode;

  /** Acknowledge frosted fallback (iframe/video you cannot sample). */
  frost?: boolean;

  /** Corner radius in px, or 'pill'. */
  radius?: number | 'pill';
  /** Bevel band as a fraction of min(w,h). Wider = bend reaches further in. */
  depth?: number;
  /**
   * Displacement strength. Prefer `strength` (0–1 fraction of min side).
   * If only `scale` is set, values ≤ 1 are treated as strength; values > 1 as px.
   */
  scale?: number;
  /** Normalized refraction strength (0–1). Overrides `scale` when provided. */
  strength?: number;
  /** Lens profile: 0 = flat/linear, 1 = spherical dome. */
  curvature?: number;
  /** 0 = radial bend, 1 = edge-perpendicular (classic rim refraction). */
  splay?: number;
  /** Chromatic aberration amount, 0–1. */
  chroma?: number;
  /** Optional blur in px. For REAL glass leave at 0. */
  blur?: number;
  /** Translucent tint over the surface. */
  tint?: string;
  /** Edge highlight strength (rim), 0–1+. Soft inset bevel; set low when using border. */
  rim?: number;
  /** Inner specular bloom, 0–1. */
  glow?: number;
  /** Specular light direction in degrees (0 = right, 90 = top). */
  specularAngle?: number;

  /** Linear-gradient stroke width in px. 0 hides the border ring. */
  borderWidth?: number;
  /** Gradient angle for the border fill, degrees. */
  borderAngle?: number;
  /** Border gradient start color (CSS color). */
  borderColorStart?: string;
  /** Border gradient middle color (CSS color). */
  borderColorMiddle?: string;
  /** Border gradient end color (CSS color). */
  borderColorEnd?: string;
  /** Opacity multiplier for borderColorStart (0–1). */
  borderOpacityStart?: number;
  /** Opacity multiplier for borderColorMiddle (0–1). */
  borderOpacityMiddle?: number;
  /** Opacity multiplier for borderColorEnd (0–1). */
  borderOpacityEnd?: number;
  /** Where the middle stop sits on the gradient, 0–1. */
  borderMiddleStop?: number;

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

function resolveDisplacementPx(
  strength: number | undefined,
  scale: number,
  width: number,
  height: number,
): number {
  const minSide = Math.max(1, Math.min(width, height));
  if (typeof strength === 'number') {
    return strength * minSide;
  }
  // Back-compat: scale ≤ 1 → fraction of min side; > 1 → pixels
  if (scale <= 1) return scale * minSide;
  return scale;
}

/** Apply an opacity to a CSS color (hex / rgb / rgba / named). */
function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  const rgb = color.trim().match(/^rgba?\((.+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(',').map((p) => p.trim());
    return `rgba(${parts[0]},${parts[1]},${parts[2]},${a})`;
  }
  return color;
}

export const GlassSurface = forwardRef<HTMLElement, GlassSurfaceProps>(function GlassSurface(
  {
    children,
    refract,
    frost = false,
    radius = 'pill',
    depth = 0.22,
    scale = 10,
    strength,
    curvature = 0.4,
    splay = 1,
    chroma = 0.2,
    blur = 0,
    tint = 'rgba(255,255,255,0.06)',
    rim = 0.8,
    glow = 0.1,
    specularAngle = 45,
    borderWidth = 0,
    borderAngle = 135,
    borderColorStart = '#ffffff',
    borderColorMiddle = '#ffffff',
    borderColorEnd = '#ffffff',
    borderOpacityStart = 0.55,
    borderOpacityMiddle = 0.4,
    borderOpacityEnd = 0.2,
    borderMiddleStop = 0.5,
    as = 'div',
    onClick,
    ariaLabel,
    title,
    className,
    style,
  },
  externalRef,
) {
  const { ref, filterId, mapUrl, ready, width, height } = useGlassRefraction({
    radius,
    depth,
    curvature,
    splay,
    specularAngle,
  });
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
  const dispPx = resolveDisplacementPx(strength, scale, width || 40, height || 40);
  const sG = dispPx;
  const sR = dispPx * (1 + 0.14 * chroma);
  const sB = dispPx * (1 - 0.14 * chroma);

  const Component = as as 'div';
  const glowAmt = Math.max(0, glow);
  const rimAmt = Math.max(0, rim);

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

      {/* Directional specular sheen (angle-aware) */}
      <div
        className="glass-layer"
        style={{
          background: `linear-gradient(${specularAngle}deg, rgba(255,255,255,${0.22 * rimAmt + 0.55 * glowAmt}) 0%, rgba(255,255,255,${0.06 * rimAmt}) 28%, transparent 52%)`,
          mixBlendMode: 'screen',
          opacity: 0.55 + glowAmt * 0.45,
        }}
      />

      {/* Inner glow bloom */}
      {glowAmt > 0 && (
        <div
          className="glass-layer"
          style={{
            boxShadow: `inset 0 0 ${6 + glowAmt * 28}px rgba(255,255,255,${0.2 + glowAmt * 0.55})`,
          }}
        />
      )}

      {/* Edge rim (soft bevel) — dial down when using the linear border ring */}
      {rimAmt > 0 && borderWidth <= 0 && (
        <div
          className="glass-layer"
          style={{
            boxShadow: `inset 0 0 0 0.5px rgba(255,255,255,${0.35 * rimAmt}), inset 0 1px 1px rgba(255,255,255,${0.28 * rimAmt}), inset 0 -1px 2px rgba(0,0,0,${0.16 * rimAmt})`,
          }}
        />
      )}

      {/* Linear-fill border ring — 3-stop gradient stroke via mask */}
      {borderWidth > 0 && (
        <div
          className="glass-layer"
          aria-hidden
          style={{
            padding: borderWidth,
            background: `linear-gradient(${borderAngle}deg, ${withAlpha(borderColorStart, borderOpacityStart)} 0%, ${withAlpha(borderColorMiddle, borderOpacityMiddle)} ${Math.round(Math.max(0, Math.min(1, borderMiddleStop)) * 100)}%, ${withAlpha(borderColorEnd, borderOpacityEnd)} 100%)`,
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            borderRadius: 'inherit',
          }}
        />
      )}

      <span className="glass-content">{children}</span>
    </Component>
  );
});
