# Liquid glass — examples

## 1. Glass chrome over Pokémon canvas

Pattern used by `PokemonCanvasWindow`:

```tsx
const iframeRef = useRef<HTMLIFrameElement>(null);
const dials = useGlassChromeDials();

<iframe ref={iframeRef} src="/pb-canvas/index.html?chrome=0" />

<GlassOverIframeButton
  iframeRef={iframeRef}
  width={dials.size.width}
  height={dials.size.height}
  radius={dials.size.pill ? 'pill' : dials.size.borderRadius}
  depth={dials.refraction.depth}
  strength={dials.refraction.strength}
  curvature={dials.refraction.curvature}
  splay={dials.refraction.splay}
  chroma={dials.refraction.chroma}
  blur={dials.refraction.blur}
  rim={dials.surface.rim}
  glow={dials.surface.glow}
  specularAngle={dials.surface.specularAngle}
  tint={`rgba(0,0,0,${dials.surface.tintOpacity})`}
  borderWidth={dials.border.width}
  borderAngle={dials.border.angle}
  borderColorStart={dials.border.colorStart}
  borderColorMiddle={dials.border.colorMiddle}
  borderColorEnd={dials.border.colorEnd}
  borderOpacityStart={dials.border.opacityStart}
  borderOpacityMiddle={dials.border.opacityMiddle}
  borderOpacityEnd={dials.border.opacityEnd}
  borderMiddleStop={dials.border.middleStop}
  onClick={() => iframeRef.current?.contentWindow?.postMessage({ type: 'pb-canvas:home' }, '*')}
>
  <Navigation size={18} strokeWidth={2} />
</GlassOverIframeButton>
```

## 2. New DialKit panel for another glass surface

```tsx
'use client';
import { useDialKit } from 'dialkit';
import { GlassButton } from '@/components/liquid-glass';

export function useNavGlassDials() {
  return useDialKit(
    'Nav Glass',
    {
      strength: [0.1, 0, 0.45, 0.001],
      tintOpacity: [0.5, 0, 0.85, 0.01],
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
    { id: 'nav-glass-v1', persist: true },
  );
}

export function GlassNavButton({ refract, children, onClick }) {
  const d = useNavGlassDials();
  return (
    <GlassButton
      refract={refract}
      strength={d.strength}
      tint={`rgba(0,0,0,${d.tintOpacity})`}
      borderWidth={d.border.width}
      borderAngle={d.border.angle}
      borderColorStart={d.border.colorStart}
      borderColorMiddle={d.border.colorMiddle}
      borderColorEnd={d.border.colorEnd}
      borderOpacityStart={d.border.opacityStart}
      borderOpacityMiddle={d.border.opacityMiddle}
      borderOpacityEnd={d.border.opacityEnd}
      borderMiddleStop={d.border.middleStop}
      radius="pill"
      onClick={onClick}
      style={{ width: 40, height: 40 }}
    >
      {children}
    </GlassButton>
  );
}
```

## 3. Counter-positioned refract copy (in-document)

Button at `right: 16, top: 16` (40×40) over a full-bleed `bgNode`:

```tsx
<div style={{ position: 'relative' }}>
  <div style={{ position: 'absolute', inset: 0 }}>{bgNode}</div>
  <GlassButton
    style={{ position: 'absolute', right: 16, top: 16, width: 40, height: 40 }}
    refract={
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
          width: 40,
          height: 40,
          transform: 'translate(16px, -16px)',
        }}
      >
        {bgNode}
      </div>
    }
  >
    …
  </GlassButton>
</div>
```

## 4. Bake dial values after tuning

1. User exports / dictates final JSON from DialKit.
2. Update each `[default, min, max, step]` first number (and color `default`s).
3. Bump options `id` (`…-vN`) so persisted old values do not win.
4. Optionally remove the dial hook later and hardcode props for production.
