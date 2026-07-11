'use client';

import { useDialKit } from 'dialkit';

/**
 * Shared live dials for Pokémon canvas glass chrome (home / expand / close).
 */
export function useGlassChromeDials() {
  return useDialKit(
    'Glass Chrome',
    {
      size: {
        width: [40, 28, 72, 1],
        height: [40, 28, 72, 1],
        pill: true,
        borderRadius: [20, 0, 36, 1],
      },
      refraction: {
        depth: [0.29, 0.05, 0.5, 0.01],
        strength: [0.1, 0, 0.45, 0.001],
        curvature: [0.4, 0, 1, 0.01],
        splay: [1, 0, 1, 0.01],
        chroma: [0.23, 0, 1, 0.01],
        blur: [1, 0, 6, 0.1],
      },
      surface: {
        rim: [0.95, 0, 1.5, 0.01],
        glow: [0.15, 0, 1, 0.01],
        specularAngle: [139, 0, 360, 1],
        tintOpacity: [0.65, 0, 0.85, 0.01],
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
      id: 'glass-chrome-v7',
      persist: true,
    },
  );
}

export type GlassChromeDials = ReturnType<typeof useGlassChromeDials>;
