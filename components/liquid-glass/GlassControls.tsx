'use client';

/**
 * Interactive controls built on GlassSurface: GlassSwitch, GlassSlider,
 * GlassSegmented.
 *
 * Each moving lens refracts a COPY of its own track (DOM these components own),
 * so refraction is always real and cross-browser. The tuning follows the one
 * governing rule: decorative lenses (switch, segmented indicator) can bend hard;
 * the slider bends gently so the value stays readable.
 *
 * All motion uses the `glass-animated` class so prefers-reduced-motion disables it.
 */

import { CSSProperties } from 'react';
import { GlassSurface } from './GlassSurface';

/* ------------------------------- Switch -------------------------------- */

export interface GlassSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  width?: number;
  height?: number;
  accent?: string;
  offColor?: string;
  ariaLabel?: string;
}

export function GlassSwitch({
  checked,
  onChange,
  width = 56,
  height = 32,
  accent = 'rgba(52,199,89,0.95)',
  offColor = 'rgba(120,120,128,0.32)',
  ariaLabel = 'Toggle',
}: GlassSwitchProps) {
  const pad = 2;
  const thumb = height - pad * 2;
  const trackFill = checked ? accent : offColor;
  const thumbLeft = checked ? width - thumb - pad : pad;

  // A copy of the track, counter-positioned so the piece under the thumb aligns.
  const trackCopy: CSSProperties = {
    position: 'absolute',
    width,
    height,
    left: -thumbLeft,
    top: -pad,
    background: trackFill,
    borderRadius: height / 2,
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width,
        height,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        borderRadius: height / 2,
        background: trackFill,
        transition: 'background 200ms ease',
      }}
    >
      <span
        className="glass-animated"
        style={{
          position: 'absolute',
          top: pad,
          left: thumbLeft,
          width: thumb,
          height: thumb,
          transition: 'left 220ms cubic-bezier(0.34,1.4,0.64,1)',
        }}
      >
        <GlassSurface
          radius="pill"
          scale={12}
          chroma={0.25}
          rim={0.9}
          tint="rgba(255,255,255,0.10)"
          refract={<div style={trackCopy} />}
          style={{
            width: thumb,
            height: thumb,
            boxShadow: '0 2px 6px rgba(0,0,0,0.28)',
          }}
        />
      </span>
    </button>
  );
}

/* ------------------------------- Slider -------------------------------- */

export interface GlassSliderProps {
  value: number; // 0–100
  onChange: (next: number) => void;
  width?: number;
  accent?: string;
  rail?: string;
  ariaLabel?: string;
}

export function GlassSlider({
  value,
  onChange,
  width = 240,
  accent = 'rgba(10,132,255,0.9)',
  rail = 'rgba(120,120,128,0.3)',
  ariaLabel = 'Slider',
}: GlassSliderProps) {
  const height = 6;
  const thumb = 22;
  const usable = width - thumb;
  const clamped = Math.max(0, Math.min(100, value));
  const thumbLeft = (clamped / 100) * usable;

  const trackCopy: CSSProperties = {
    position: 'absolute',
    width,
    height: thumb,
    left: -thumbLeft,
    top: 0,
    borderRadius: thumb / 2,
    background: `linear-gradient(to right, ${accent} 0%, ${accent} ${clamped}%, ${rail} ${clamped}%, ${rail} 100%)`,
  };

  return (
    <div style={{ position: 'relative', width, height: thumb, display: 'flex', alignItems: 'center' }}>
      <input
        type="range"
        min={0}
        max={100}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: thumb,
          opacity: 0,
          cursor: 'pointer',
          margin: 0,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (thumb - height) / 2,
          height,
          borderRadius: height / 2,
          background: `linear-gradient(to right, ${accent} 0%, ${accent} ${clamped}%, ${rail} ${clamped}%, ${rail} 100%)`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: thumbLeft,
          width: thumb,
          height: thumb,
        }}
      >
        <GlassSurface
          radius="pill"
          scale={6}
          chroma={0.18}
          rim={0.9}
          tint="rgba(255,255,255,0.12)"
          refract={<div style={trackCopy} />}
          style={{ width: thumb, height: thumb, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
        />
      </span>
    </div>
  );
}

/* ----------------------------- Segmented ------------------------------- */

export interface GlassSegmentedProps {
  options: string[];
  value: number; // selected index
  onChange: (index: number) => void;
  width?: number;
  height?: number;
  accent?: string;
}

export function GlassSegmented({
  options,
  value,
  onChange,
  width = 280,
  height = 40,
  accent = 'rgba(255,255,255,0.10)',
}: GlassSegmentedProps) {
  const n = Math.max(1, options.length);
  const segW = width / n;
  const lensLeft = value * segW;

  const trackCopy: CSSProperties = {
    position: 'absolute',
    width,
    height,
    left: -lensLeft,
    top: 0,
    borderRadius: height / 2,
    background: `linear-gradient(120deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))`,
  };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: height / 2,
        background: 'rgba(120,120,128,0.22)',
        padding: 0,
      }}
    >
      <span
        className="glass-animated"
        style={{
          position: 'absolute',
          top: 0,
          left: lensLeft,
          width: segW,
          height,
          transition: 'left 260ms cubic-bezier(0.34,1.3,0.64,1)',
        }}
      >
        <GlassSurface
          radius="pill"
          scale={9}
          chroma={0.2}
          rim={0.85}
          tint={accent}
          refract={<div style={trackCopy} />}
          style={{ width: segW, height, boxShadow: '0 4px 12px rgba(0,0,0,0.24)' }}
        />
      </span>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1 }}>
        {options.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(i)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: i === value ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.6)',
              fontSize: 14,
              fontWeight: 500,
              transition: 'color 200ms ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
