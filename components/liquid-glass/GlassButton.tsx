'use client';

/**
 * GlassButton / GlassPill — thin wrappers over GlassSurface.
 */

import { CSSProperties, ReactNode, forwardRef } from 'react';
import { GlassSurface } from './GlassSurface';

interface CommonProps {
  children: ReactNode;
  refract?: ReactNode;
  frost?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  scale?: number;
  strength?: number;
  chroma?: number;
  rim?: number;
  tint?: string;
  depth?: number;
  blur?: number;
  curvature?: number;
  splay?: number;
  glow?: number;
  specularAngle?: number;
  borderWidth?: number;
  borderAngle?: number;
  borderColorStart?: string;
  borderColorMiddle?: string;
  borderColorEnd?: string;
  borderOpacityStart?: number;
  borderOpacityMiddle?: number;
  borderOpacityEnd?: number;
  borderMiddleStop?: number;
}

interface GlassButtonProps extends CommonProps {
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
  radius?: number | 'pill';
}

export const GlassButton = forwardRef<HTMLElement, GlassButtonProps>(function GlassButton(
  {
    children,
    refract,
    frost,
    onClick,
    ariaLabel,
    title,
    radius = 'pill',
    scale = 8,
    strength,
    chroma = 0.18,
    rim = 0.9,
    tint = 'rgba(255,255,255,0.07)',
    depth,
    blur,
    curvature,
    splay,
    glow,
    specularAngle,
    borderWidth,
    borderAngle,
    borderColorStart,
    borderColorMiddle,
    borderColorEnd,
    borderOpacityStart,
    borderOpacityMiddle,
    borderOpacityEnd,
    borderMiddleStop,
    className,
    contentClassName,
    style,
  },
  ref,
) {
  return (
    <GlassSurface
      ref={ref}
      as="button"
      radius={radius}
      scale={scale}
      strength={strength}
      chroma={chroma}
      rim={rim}
      tint={tint}
      depth={depth}
      blur={blur}
      curvature={curvature}
      splay={splay}
      glow={glow}
      specularAngle={specularAngle}
      borderWidth={borderWidth}
      borderAngle={borderAngle}
      borderColorStart={borderColorStart}
      borderColorMiddle={borderColorMiddle}
      borderColorEnd={borderColorEnd}
      borderOpacityStart={borderOpacityStart}
      borderOpacityMiddle={borderOpacityMiddle}
      borderOpacityEnd={borderOpacityEnd}
      borderMiddleStop={borderMiddleStop}
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 28px rgba(0,0,0,0.28)',
        transition: 'transform 150ms ease',
        ...style,
      }}
    >
      <span
        className={contentClassName}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
        }}
      >
        {children}
      </span>
    </GlassSurface>
  );
});

export function GlassPill({
  children,
  refract,
  frost,
  scale = 7,
  strength,
  chroma = 0.16,
  rim = 0.85,
  tint = 'rgba(255,255,255,0.07)',
  depth,
  blur,
  curvature,
  splay,
  glow,
  specularAngle,
  className,
  contentClassName,
  style,
}: CommonProps) {
  return (
    <GlassSurface
      radius="pill"
      scale={scale}
      strength={strength}
      chroma={chroma}
      rim={rim}
      tint={tint}
      depth={depth}
      blur={blur}
      curvature={curvature}
      splay={splay}
      glow={glow}
      specularAngle={specularAngle}
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
