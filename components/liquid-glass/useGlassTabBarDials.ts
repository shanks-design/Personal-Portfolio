'use client';

import { useDialKit } from 'dialkit';

/**
 * Live dials for the Pokémon canvas glass tab bar.
 */
export function useGlassTabBarDials() {
  return useDialKit(
    'Glass Tab Bar',
    {
      size: {
        height: [56, 36, 80, 1],
        iconScale: [0.45, 0.25, 0.7, 0.01],
        itemWidth: [0.85, 0.5, 1.4, 0.01],
        padX: [0.18, 0.05, 0.4, 0.01],
        pill: true,
        borderRadius: [20, 0, 40, 1],
      },
      refraction: {
        depth: [0.29, 0.05, 0.5, 0.01],
        strength: [0.1, 0, 0.45, 0.001],
        curvature: [0.4, 0, 1, 0.01],
        splay: [1, 0, 1, 0.01],
        chroma: [0.23, 0, 1, 0.01],
        blur: [12, 0, 24, 0.5],
      },
      surface: {
        rim: [0.95, 0, 1.5, 0.01],
        glow: [0.15, 0, 1, 0.01],
        specularAngle: [139, 0, 360, 1],
        tintOpacity: [0.55, 0, 0.9, 0.01],
      },
      border: {
        width: [1, 0, 4, 0.25],
        angle: [139, 0, 360, 1],
        colorStart: { type: 'color', default: '#ffffff' },
        colorMiddle: { type: 'color', default: '#000000' },
        colorEnd: { type: 'color', default: '#ffffff' },
        opacityStart: [0.45, 0, 1, 0.01],
        opacityMiddle: [0.2, 0, 1, 0.01],
        opacityEnd: [0.45, 0, 1, 0.01],
        middleStop: [0.5, 0, 1, 0.01],
      },
    },
    {
      id: 'glass-tab-bar-v1',
      persist: true,
    },
  );
}

export type GlassTabBarDials = ReturnType<typeof useGlassTabBarDials>;
