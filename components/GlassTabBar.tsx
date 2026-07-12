'use client';

import { CSSProperties } from 'react';
import { Home, Search, User } from 'lucide-react';
import { GlassSurface } from '@/components/liquid-glass';
import { useGlassTabBarDials } from '@/components/liquid-glass/useGlassTabBarDials';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'search', label: 'Search', icon: Search },
] as const;

/** Glass tab bar for the Pokémon canvas — icon-only; styled via DialKit. */
export default function GlassTabBar({ style }: { style?: CSSProperties }) {
  const dials = useGlassTabBarDials();
  const height = dials.size.height;
  const iconSize = Math.round(height * dials.size.iconScale);
  const hPad = Math.round(height * dials.size.padX);
  const itemW = Math.round(height * dials.size.itemWidth);
  const radius = dials.size.pill ? ('pill' as const) : dials.size.borderRadius;

  return (
    <nav
      aria-label="Canvas tabs"
      style={{ position: 'absolute', left: 16, bottom: 16, zIndex: 10, ...style }}
    >
      <GlassSurface
        frost
        radius={radius}
        depth={dials.refraction.depth}
        strength={dials.refraction.strength}
        curvature={dials.refraction.curvature}
        splay={dials.refraction.splay}
        chroma={dials.refraction.chroma}
        blur={dials.refraction.blur}
        rim={dials.surface.rim}
        glow={dials.surface.glow}
        specularAngle={dials.surface.specularAngle}
        tint={`rgba(20,20,22,${dials.surface.tintOpacity})`}
        borderWidth={dials.border.width}
        borderAngle={dials.border.angle}
        borderColorStart={dials.border.colorStart}
        borderColorMiddle={dials.border.colorMiddle}
        borderColorEnd={dials.border.colorEnd}
        borderOpacityStart={dials.border.opacityStart}
        borderOpacityMiddle={dials.border.opacityMiddle}
        borderOpacityEnd={dials.border.opacityEnd}
        borderMiddleStop={dials.border.middleStop}
        style={{
          height,
          padding: `0 ${hPad}px`,
          boxShadow: '0 16px 40px -12px rgba(0,0,0,0.45)',
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ul
          className="m-0 flex h-full list-none items-center gap-0.5 p-0"
          role="list"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <li key={id} className="flex h-full items-center">
              <button
                type="button"
                aria-label={label}
                className="relative flex items-center justify-center border-0 bg-transparent outline-none"
                style={{
                  width: itemW,
                  height: height - 8,
                  borderRadius: 9999,
                  color: 'rgba(255,255,255,0.92)',
                  cursor: 'none',
                }}
              >
                <Icon size={iconSize} strokeWidth={2} aria-hidden style={{ display: 'block' }} />
              </button>
            </li>
          ))}
        </ul>
      </GlassSurface>
    </nav>
  );
}
