'use client';

/**
 * GlassButton / GlassPill — thin wrappers over GlassSurface.
 *
 * Both need a `refract` source (a copy of what is behind them) to be real glass.
 * If they sit over an iframe/video you cannot sample, pass `frost` and accept the
 * frosted look. See references/backdrop-access.md.
 */

import { CSSProperties, ReactNode } from 'react';
import { GlassSurface } from './GlassSurface';

interface CommonProps {
  children: ReactNode;
  /** Copy of the background to bend (DOM you control). Omit only with `frost`. */
  refract?: ReactNode;
  frost?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  /** Strength of refraction. Buttons/pills carry labels, so keep this low. */
  scale?: number;
  chroma?: number;
  rim?: number;
  tint?: string;
}

interface GlassButtonProps extends CommonProps {
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
  /** 'pill' for a capsule, or a px radius. 'circle' handled by equal w/h + pill. */
  radius?: number | 'pill';
}

export function GlassButton({
  children,
  refract,
  frost,
  onClick,
  ariaLabel,
  title,
  radius = 'pill',
  scale = 8,
  chroma = 0.18,
  rim = 0.9,
  tint = 'rgba(255,255,255,0.07)',
  className,
  contentClassName,
  style,
}: GlassButtonProps) {
  return (
    <GlassSurface
      as="button"
      radius={radius}
      scale={scale}
      chroma={chroma}
      rim={rim}
      tint={tint}
      refract={refract}
      frost={frost}
      onClick={onClick}
      ariaLabel={ariaLabel}
      title={title}
      className={className}
      style={{
        cursor: 'pointer',
        border: 'none',
        padding: 0,
        boxShadow: '0 10px 28px rgba(0,0,0,0.28)',
        transition: 'transform 150ms ease',
        ...style,
      }}
    >
      <span
        className={contentClassName}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {children}
      </span>
    </GlassSurface>
  );
}

export function GlassPill({
  children,
  refract,
  frost,
  scale = 7,
  chroma = 0.16,
  rim = 0.85,
  tint = 'rgba(255,255,255,0.07)',
  className,
  contentClassName,
  style,
}: CommonProps) {
  return (
    <GlassSurface
      radius="pill"
      scale={scale}
      chroma={chroma}
      rim={rim}
      tint={tint}
      refract={refract}
      frost={frost}
      className={className}
      style={{ boxShadow: '0 10px 28px rgba(0,0,0,0.28)', ...style }}
    >
      <span
        className={contentClassName}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px' }}
      >
        {children}
      </span>
    </GlassSurface>
  );
}
