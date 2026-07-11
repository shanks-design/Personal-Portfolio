'use client';

/**
 * useGlassRefraction — the engine.
 *
 * This is the part that MUST NOT be re-derived by hand. It generates the
 * displacement map and manages the SVG filter with every cross-browser fix
 * baked in. Consume it through <GlassSurface>; you should rarely touch it.
 *
 * What it guarantees (the things that separate real glass from a blur):
 *   - The map is delivered as a blob: URL, never a data: URI (Safari rejects
 *     data: URIs inside feImage and silently collapses to flat frost).
 *   - A fresh filter id on every rebuild (Safari caches filter output by id and
 *     would otherwise freeze the effect on the first frame).
 *   - The map is computed with four-fold symmetry (a quarter of the pixels,
 *     mirrored) so it stays inside the frame budget on resize.
 *   - color-interpolation-filters is forced to sRGB by the consumer (see
 *     GlassSurface) so the map means what it says.
 *
 * It does NOT apply a blur. Blur is not glass. If you find yourself adding
 * backdrop-filter: blur() to "fix" the look, stop: that is the frost bug.
 */

import { useEffect, useRef, useState } from 'react';

export interface GlassGeometry {
  /** Corner radius in px, or 'pill' for a fully rounded capsule. */
  radius?: number | 'pill';
  /** Bevel band width as a fraction of min(width, height). 0.05–0.5. The band
   *  is where the bend lives; the flat centre is left alone. */
  depth?: number;
}

interface GlassState {
  filterId: string;
  mapUrl: string;
  width: number;
  height: number;
  ready: boolean;
}

let glassCounter = 0;

/** Signed distance to a rounded rectangle. Negative inside, 0 on the edge. */
function sdRoundRect(px: number, py: number, hw: number, hh: number, r: number): number {
  const qx = Math.abs(px) - (hw - r);
  const qy = Math.abs(py) - (hh - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/**
 * Build a rounded-rect displacement map as a blob: URL.
 * R = horizontal push, G = vertical push (128 = no movement),
 * B = edge/specular mask. Only the bevel band moves; everything else is neutral.
 */
function buildMap(w: number, h: number, radius: number, depthFrac: number): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    const img = ctx.createImageData(w, h);
    const data = img.data;
    const hw = w / 2;
    const hh = h / 2;
    const r = Math.min(radius, Math.min(hw, hh));
    const bevel = Math.max(1, Math.min(depthFrac * Math.min(w, h), Math.min(hw, hh)));
    const cx = (w - 1) / 2;
    const cy = (h - 1) / 2;
    const qw = Math.ceil(w / 2);
    const qh = Math.ceil(h / 2);
    const eps = 1;

    const write = (X: number, Y: number, dispX: number, dispY: number, mask: number) => {
      if (X >= w || Y >= h) return;
      const idx = (Y * w + X) * 4;
      data[idx] = clamp255(128 + dispX * 127);
      data[idx + 1] = clamp255(128 + dispY * 127);
      data[idx + 2] = clamp255(128 + mask * 127);
      data[idx + 3] = 255;
    };

    for (let y = 0; y < qh; y++) {
      for (let x = 0; x < qw; x++) {
        const px = x - cx;
        const py = y - cy;
        const d = sdRoundRect(px, py, hw, hh, r);
        const edge = -d; // distance inward from the edge (positive inside)

        let dispX = 0;
        let dispY = 0;
        let mask = 0;

        if (edge >= 0 && edge < bevel) {
          const t = edge / bevel; // 0 at the rim, 1 at the inner end of the band
          const m = Math.pow(1 - t, 1.6); // strongest right at the rim
          // Surface normal from the SDF gradient (points outward).
          const gx = sdRoundRect(px + eps, py, hw, hh, r) - sdRoundRect(px - eps, py, hw, hh, r);
          const gy = sdRoundRect(px, py + eps, hw, hh, r) - sdRoundRect(px, py - eps, hw, hh, r);
          const gl = Math.hypot(gx, gy) || 1;
          dispX = (gx / gl) * m;
          dispY = (gy / gl) * m;
          mask = m;
        }

        // Four-fold symmetry: write this pixel into all four quadrants,
        // flipping X across the vertical axis and Y across the horizontal.
        write(x, y, dispX, dispY, mask);
        write(w - 1 - x, y, -dispX, dispY, mask);
        write(x, h - 1 - y, dispX, -dispY, mask);
        write(w - 1 - x, h - 1 - y, -dispX, -dispY, mask);
      }
    }

    ctx.putImageData(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve('');
        return;
      }
      resolve(URL.createObjectURL(blob)); // blob URL, never a data: URI
    }, 'image/png');
  });
}

export function useGlassRefraction(geom: GlassGeometry = {}) {
  const { radius = 'pill', depth = 0.22 } = geom;
  const ref = useRef<HTMLElement | null>(null);
  const urlRef = useRef<string>('');
  const [state, setState] = useState<GlassState>({
    filterId: '',
    mapUrl: '',
    width: 0,
    height: 0,
    ready: false,
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;

    const rebuild = async () => {
      const rect = node.getBoundingClientRect();
      const width = Math.max(8, Math.round(rect.width));
      const height = Math.max(8, Math.round(rect.height));
      const rad = radius === 'pill' ? Math.min(width, height) / 2 : radius;
      const url = await buildMap(width, height, rad, depth);
      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;
      setState({
        filterId: `glass-${++glassCounter}`, // fresh id every rebuild (Safari)
        mapUrl: url,
        width,
        height,
        ready: Boolean(url),
      });
    };

    rebuild();
    const ro = new ResizeObserver(() => rebuild());
    ro.observe(node);
    return () => {
      cancelled = true;
      ro.disconnect();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [radius, depth]);

  return { ref, ...state };
}
