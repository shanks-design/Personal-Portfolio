# Liquid glass — reference

## Engine guarantees (`useGlassRefraction`)

- Displacement map = `blob:` URL (never `data:`)
- Fresh filter id on every rebuild (Safari cache)
- Four-fold map symmetry for cost
- `color-interpolation-filters="sRGB"` on the SVG filter
- Map channels: R/G = displacement; B = specular mask (curvature / splay / specularAngle shape the field)

## GlassSurface props

| Prop | Type | Notes |
|------|------|-------|
| `refract` | `ReactNode` | Same-doc backdrop copy for real glass |
| `frost` | `boolean` | Honest blur fallback |
| `radius` | `number \| 'pill'` | Corner / capsule |
| `depth` | `number` | Bevel band fraction of min side |
| `strength` | `number` | Preferred bend (0–1 × min side) |
| `scale` | `number` | Legacy: ≤1 treated as strength; >1 as px |
| `curvature` | `number` | 0 linear → 1 spherical |
| `splay` | `number` | 0 radial → 1 edge-normal |
| `chroma` | `number` | Aberration 0–1 |
| `blur` | `number` | px; prefer 0–1 for real glass |
| `tint` | `string` | CSS color wash |
| `rim` | `number` | Soft bevel; skipped if `borderWidth > 0` |
| `glow` | `number` | Bloom + sheen |
| `specularAngle` | `number` | Degrees |
| `borderWidth` | `number` | px; 0 hides linear ring |
| `borderAngle` | `number` | Gradient degrees |
| `borderColorStart/Middle/End` | `string` | Hex/CSS |
| `borderOpacityStart/Middle/End` | `number` | 0–1 |
| `borderMiddleStop` | `number` | 0–1 position of middle stop |

## Linear border ring

Implemented as a masked gradient layer (works with `border-radius` / pill):

```css
padding: borderWidth;
background: linear-gradient(angle, start, middle stop%, end);
-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
-webkit-mask-composite: xor;
mask-composite: exclude;
```

## Iframe chrome protocol (pb-canvas)

Parent loads `/pb-canvas/index.html?chrome=0`.

| Direction | Message | Purpose |
|-----------|---------|---------|
| iframe → parent | `{ type: 'pb-canvas:frame' }` | Re-capture refract bitmaps on pan/zoom |
| parent → iframe | `{ type: 'pb-canvas:home' }` | Reset view |

`GlassOverIframeButton` listens for frames from its `iframeRef.contentWindow`, captures the button’s region via `captureIframeRegion`, and passes a blob `<img>` as `refract`.

## DialKit setup checklist

```bash
npm install dialkit motion
```

```tsx
// components/DialKitProvider.tsx — client, dev-only
import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';
export default function DialKitProvider() {
  if (process.env.NODE_ENV !== 'development') return null;
  return <DialRoot />;
}
```

```tsx
// app/layout.tsx
<body>
  {children}
  <DialKitProvider />
</body>
```

```tsx
const dials = useDialKit('Panel', { /* config */ }, { id: 'stable-id', persist: true });
```

When baking user-locked values: update `[default, min, max, step]` first elements / color `default`s, then bump `id`.

## Locked chrome defaults (v7)

See `useGlassChromeDials.ts` — size 40×40 pill; depth 0.29; strength 0.1; curvature 0.4; splay 1; chroma 0.23; blur 1; rim 0.95; glow 0.15; specularAngle 139; tintOpacity 0.65; border 1px @ 139° white→black→white with opacities 0.45 / 0.2 / 0.45.

## Accessibility

`glass.css` already handles:

- `prefers-reduced-transparency: reduce` → solid opaque surface
- `prefers-reduced-motion: reduce` → no spring on `.glass-animated`
