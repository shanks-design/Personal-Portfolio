'use client';

/**
 * useGlassRefraction — the engine.
 *
 * Generates the displacement map and manages the SVG filter with every
 * cross-browser fix baked in. Consume it through <GlassSurface>.
 *
 * Guarantees:
 *   - Map as blob: URL (never data: — Safari rejects data: in feImage)
 *   - Fresh filter id every rebuild (Safari caches by id)
 *   - Four-fold symmetry for map compute cost
 *   - color-interpolation-filters forced to sRGB by GlassSurface
 *
 * Optics encoded in the map:
 *   - R/G = displacement (curvature + splay shape the field)
 *   - B   = specular mask (from surface normal · light direction)
 *
 * It does NOT apply a blur. Blur is not glass.
 */

import { useEffect, useRef, useState } from 'react';

export interface GlassGeometry {
  /** Corner radius in px, or 'pill' for a fully rounded capsule. */
  radius?: number | 'pill';
  /** Bevel band width as a fraction of min(width, height). 0.05–0.5. */
  depth?: number;
  /** Lens profile: 0 = linear falloff (flat), 1 = spherical dome. */
  curvature?: number;
  /** 0 = radial (toward center), 1 = edge-perpendicular normals. */
  splay?: number;
  /** Specular light direction in degrees (0 = from right, 90 = from top). */
  specularAngle?: number;
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

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * Build a rounded-rect displacement map as a blob: URL.
 * R = horizontal push, G = vertical push (128 = no movement),
 * B = specular / edge mask.
 */
function buildMap(
  w: number,
  h: number,
  radius: number,
  depthFrac: number,
  curvature: number,
  splay: number,
  specularAngleDeg: number,
): Promise<string> {
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

    const curv = clamp01(curvature);
    const spl = clamp01(splay);
    const lightAngle = (specularAngleDeg * Math.PI) / 180;
    const lightX = Math.cos(lightAngle);
    const lightY = -Math.sin(lightAngle); // CSS/y-down: 90° = light from top

    const write = (X: number, Y: number, dispX: number, dispY: number, spec: number) => {
      if (X >= w || Y >= h) return;
      const idx = (Y * w + X) * 4;
      data[idx] = clamp255(128 + dispX * 127);
      data[idx + 1] = clamp255(128 + dispY * 127);
      data[idx + 2] = clamp255(spec * 255);
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
        let spec = 0;

        if (edge >= 0 && edge < bevel) {
          const t = edge / bevel; // 0 at rim, 1 at inner end of band

          // Curvature: blend linear falloff → spherical dome profile
          const linear = 1 - t;
          const spherical = Math.sqrt(Math.max(0, 1 - t * t));
          const m = (1 - curv) * linear + curv * spherical;

          // Surface normal from SDF (outward)
          const gx = sdRoundRect(px + eps, py, hw, hh, r) - sdRoundRect(px - eps, py, hw, hh, r);
          const gy = sdRoundRect(px, py + eps, hw, hh, r) - sdRoundRect(px, py - eps, hw, hh, r);
          const gl = Math.hypot(gx, gy) || 1;
          const nx = gx / gl;
          const ny = gy / gl;

          // Splay: blend radial (center-out) with edge-perpendicular normals
          const rl = Math.hypot(px, py) || 1;
          const rx = px / rl;
          const ry = py / rl;
          const dx = (1 - spl) * rx + spl * nx;
          const dy = (1 - spl) * ry + spl * ny;
          const dl = Math.hypot(dx, dy) || 1;

          dispX = (dx / dl) * m;
          dispY = (dy / dl) * m;

          // Specular: how much the outward normal faces the light
          const ndotl = Math.max(0, nx * lightX + ny * lightY);
          spec = Math.pow(ndotl, 1.8) * m;
        }

        write(x, y, dispX, dispY, spec);
        write(w - 1 - x, y, -dispX, dispY, spec);
        write(x, h - 1 - y, dispX, -dispY, spec);
        write(w - 1 - x, h - 1 - y, -dispX, -dispY, spec);
      }
    }

    ctx.putImageData(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve('');
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}

export function useGlassRefraction(geom: GlassGeometry = {}) {
  const {
    radius = 'pill',
    depth = 0.22,
    curvature = 0.4,
    splay = 1,
    specularAngle = 45,
  } = geom;
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
      const url = await buildMap(width, height, rad, depth, curvature, splay, specularAngle);
      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;
      setState({
        filterId: `glass-${++glassCounter}`,
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
  }, [radius, depth, curvature, splay, specularAngle]);

  return { ref, ...state };
}
