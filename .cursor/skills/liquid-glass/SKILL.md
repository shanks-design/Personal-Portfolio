---
name: liquid-glass
description: >-
  Build Apple-style liquid glass UI with this project's real refraction engine
  (GlassSurface / GlassButton / GlassOverIframeButton), DialKit live tuning, and
  linear border optics. Use when the user wants glass, glassy, glassmorphism,
  liquid-glass, frosted, refractive, lens effects, glass buttons/pills/panels,
  DialKit glass dials, or to fix fake/smudged glass over iframes.
---

# Liquid Glass (portfolio engine)

Glass is a **bend**, not a **blur**. Use the bundled engine in
`components/liquid-glass/` — never hand-roll `feDisplacementMap` or
`backdrop-filter: url(#…)`.

## Never do this

1. **Never** `backdrop-filter: url(#svgfilter)` for displacement (Safari drops `url()`, only blur remains → smudge).
2. **Never** use blur as a stand-in for refraction. Real glass defaults `blur` to `0` (or keep it low and intentional).
3. **Never** feed displacement maps as `data:` URIs (Safari rejects them in `feImage`). The engine uses `blob:` URLs.
4. **Never** claim refraction over an `<iframe>`, `<video>`, or cross-origin backdrop without a same-document sampleable copy.

## Decision gate

**Is the backdrop DOM you control in the same document?**

| Backdrop | Mode | How |
|----------|------|-----|
| Divs / images / in-document canvas | **REFRACT** | Pass `refract={…}` — a counter-positioned copy of what’s behind |
| Same-origin iframe (e.g. pb-canvas) | **REFRACT via capture** | Use `GlassOverIframeButton` / `captureIframeRegion` |
| Cross-origin iframe / video / unknown | **FROST** | Pass `frost` — honest blur + tint + rim, not glass |

## Component map

| File | Role |
|------|------|
| `GlassSurface.tsx` | Primitive — always compose from this |
| `useGlassRefraction.ts` | Displacement map engine (do not re-derive) |
| `GlassButton.tsx` / `GlassPill` | Controls |
| `GlassOverIframeButton.tsx` | Live refract over same-origin iframe |
| `captureIframeRegion.ts` | Crops iframe cards → blob `refract` img |
| `GlassControls.tsx` | Switch / slider / segmented |
| `glass.css` | Import once in `app/globals.css` |
| `useGlassChromeDials.ts` | DialKit presets for chrome buttons |
| `DialKitProvider.tsx` | Dev-only `<DialRoot />` |

Import from `@/components/liquid-glass`.

## Quick recipes

### Real glass button (in-document backdrop)

```tsx
import { GlassButton } from '@/components/liquid-glass';

<GlassButton
  refract={<div style={{ /* counter-positioned backdrop copy */ }} />}
  strength={0.1}
  depth={0.29}
  curvature={0.4}
  splay={1}
  chroma={0.23}
  blur={1}
  rim={0.95}
  glow={0.15}
  specularAngle={139}
  tint="rgba(0,0,0,0.65)"
  borderWidth={1}
  borderAngle={139}
  borderColorStart="#ffffff"
  borderColorMiddle="#000000"
  borderColorEnd="#ffffff"
  borderOpacityStart={0.45}
  borderOpacityMiddle={0.2}
  borderOpacityEnd={0.45}
  borderMiddleStop={0.5}
  radius="pill"
  style={{ width: 40, height: 40 }}
>
  {/* icon */}
</GlassButton>
```

Counter-position: if the button is at `(x, y)` in the backdrop, translate the
`refract` copy by `(-x, -y)` so the bend lines up 1:1.

### Over same-origin iframe

Use `GlassOverIframeButton` with an `iframeRef`. Prefer iframe `?chrome=0` and
parent-owned chrome. See [examples.md](examples.md).

### Honest frost

```tsx
<GlassButton frost radius="pill" style={{ width: 40, height: 40 }}>…</GlassButton>
```

## Optics cheatsheet

| Prop | Meaning |
|------|---------|
| `strength` | Bend amount as fraction of min(w,h) (prefer over px `scale`) |
| `depth` | Bevel band width (0.05–0.5) |
| `curvature` | 0 flat → 1 spherical dome falloff |
| `splay` | 0 radial → 1 edge-perpendicular normals |
| `chroma` | RGB fringe |
| `blur` | Softening; keep low for real glass |
| `rim` | Soft inset bevel (hidden when `borderWidth > 0`) |
| `glow` | Inner bloom + specular sheen strength |
| `specularAngle` | Light direction (deg) |
| `tint` | Contrast wash over refracted pixels |
| `border*` | Linear 3-stop gradient stroke via mask |

Tune strength to legibility: controls ~0.08–0.15; decorative lenses higher.

## DialKit workflow

1. Ensure deps: `dialkit`, `motion`.
2. Mount once: `<DialKitProvider />` in `app/layout.tsx` (dev-only panel).
3. Call `useDialKit('Panel Name', config, { id, persist: true })` in the client component that owns the glass.
4. Pipe dial values into `GlassSurface` / `GlassOverIframeButton` props.
5. When the user locks values, bake them as config defaults and bump `id` (e.g. `glass-chrome-v8`) so old localStorage does not override.

Slider shape: `[default, min, max, step?]`. Colors: `{ type: 'color', default: '#fff' }`.

Canonical chrome dials: `useGlassChromeDials` — copy that pattern for new panels.

## Verify before done

1. Backdrop is busy/detail-rich (not flat black) when proving refraction.
2. Content behind is **bent and sharp**, not softened.
3. No `backdrop-filter` on the real-glass path (except acknowledged `frost`).
4. Icons/labels remain readable (use dark `tint` if needed).
5. Reduced-transparency still works via `glass.css`.

## More detail

- Props, border ring, iframe messaging: [reference.md](reference.md)
- Worked patterns (chrome, dials, counter-position): [examples.md](examples.md)
