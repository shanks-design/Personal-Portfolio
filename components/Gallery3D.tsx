'use client';

import { animate } from 'motion';
import { useDialKit } from 'dialkit';
import { useEffect, useRef, type MutableRefObject } from 'react';

const GAP = 24;
const DRAG_GAIN = 1.35;
const DAMPING = 0.3;
const CLICK_SLOP = 5;
const PAD_Y = 0.12;
const CARD_W = 806;
const CARD_H = 452;
const MAX_FLARE_TOP = 120;
const MAX_FLARE_BOTTOM = 120;
export const GALLERY_CARD_H = CARD_H;
export const GALLERY_FLARE_TOP = MAX_FLARE_TOP;
export const GALLERY_FLARE_BOTTOM = MAX_FLARE_BOTTOM;
export const GALLERY_INDEX_GAP = 48;

export type GalleryProject = {
  title: string;
  href: string;
  image: string;
};

const VERT = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uEdgeWidth;
uniform float uBend;
uniform float uLift;
uniform float uBow;
uniform float uPadX;
uniform float uPadY;
uniform float uWarpLeft;
uniform float uPower;
uniform float uOverscan;
uniform float uModel;
varying vec2 vUv;

vec2 padUV(vec2 p) {
  return vec2(
    uPadX + p.x * (1.0 - 2.0 * uPadX),
    uPadY + p.y * (1.0 - 2.0 * uPadY)
  );
}

vec2 cylinderFromS(float s, float side) {
  float alpha = clamp(uBend, 0.08, 1.45);
  s = pow(clamp(s, 0.0, 1.0), max(uPower, 0.4));
  float theta = s * alpha;
  float unroll = tan(theta) / max(tan(alpha), 0.0001);
  float ny = vUv.y * 2.0 - 1.0;
  float srcX = side > 0.0
    ? mix(1.0 - uEdgeWidth, 1.0 + uOverscan, unroll)
    : mix(uEdgeWidth, -uOverscan, unroll);
  srcX += ny * ny * unroll * uBow * 0.16 * side;
  float yScale = 1.0 + unroll * uLift * (0.5 + 0.5 * abs(ny));
  float yInner = 0.5 + (vUv.y - 0.5) / yScale;
  return vec2(
    uPadX + srcX * (1.0 - 2.0 * uPadX),
    uPadY + yInner * (1.0 - 2.0 * uPadY)
  );
}

void main() {
  float edge = max(uEdgeWidth, 0.001);
  float sLeft = clamp((edge - vUv.x) / edge, 0.0, 1.0) * uWarpLeft;
  float sRight = clamp((vUv.x - (1.0 - edge)) / edge, 0.0, 1.0);
  vec2 uv = padUV(vUv);
  float ny = vUv.y * 2.0 - 1.0;

  if (uModel < 0.5) {
    if (sRight > 0.0) uv = cylinderFromS(sRight, 1.0);
    if (sLeft > 0.0) uv = cylinderFromS(sLeft, -1.0);
  } else if (uModel < 1.5) {
    float s = max(sLeft, sRight);
    float side = vUv.x < 0.5 ? -1.0 : 1.0;
    float k = pow(s, max(uPower, 0.4));
    float pull = k * (0.08 + uOverscan * 0.7);
    uv.x += side * pull * (1.0 - 2.0 * uPadX);
    float yScale = 1.0 + k * k * uLift * (0.45 + 0.55 * abs(ny));
    float yInner = 0.5 + (vUv.y - 0.5) / yScale;
    uv.y = uPadY + yInner * (1.0 - 2.0 * uPadY);
    uv.x += side * ny * ny * k * uBow * 0.07;
  } else if (uModel < 2.5) {
    float nx = vUv.x * 2.0 - 1.0;
    float flatten = (1.0 - smoothstep(0.0, 0.4, vUv.x)) * (1.0 - uWarpLeft);
    nx *= 1.0 - flatten * 0.92;
    float alpha = clamp(uBend, 0.08, 1.45);
    float theta = clamp(nx * alpha, -1.45, 1.45);
    float unroll = tan(theta) / max(tan(alpha), 0.0001);
    float srcX = 0.5 + unroll * (0.5 + uOverscan * 0.5);
    srcX += ny * ny * unroll * uBow * 0.1;
    float yScale = 1.0 + abs(unroll) * uLift * (0.5 + 0.5 * abs(ny));
    float yInner = 0.5 + (vUv.y - 0.5) / yScale;
    uv = vec2(
      uPadX + srcX * (1.0 - 2.0 * uPadX),
      uPadY + yInner * (1.0 - 2.0 * uPadY)
    );
    uv = mix(uv, padUV(vUv), flatten);
  } else {
    float mask = pow(max(sLeft, sRight), 1.35);
    if (mask > 0.001) {
      float nx = vUv.x * 2.0 - 1.0;
      float theta = clamp(nx * mask * uBend, -1.05, 1.05);
      uv.x += tan(theta) * 0.055;
      float yScale = 1.0 + mask * uLift * (0.55 + 0.45 * abs(ny));
      float yInner = 0.5 + (vUv.y - 0.5) / yScale;
      uv.y = uPadY + yInner * (1.0 - 2.0 * uPadY);
      uv.x += nx * ny * ny * mask * uBow * 0.06;
    }
  }

  if (uv.x < 0.001 || uv.x > 0.999 || uv.y < 0.001 || uv.y > 0.999) {
    gl_FragColor = vec4(0.0);
    return;
  }
  gl_FragColor = texture2D(tDiffuse, uv);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Gallery3D shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const CARD_RADIUS = 0;

function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  const rr = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.fillStyle = '#D4D4D4';
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.fill();
}

export default function Gallery3D({
  projects,
  onProgress,
  seekRef,
}: {
  projects: readonly GalleryProject[];
  onProgress?: (progress: number, index: number) => void;
  seekRef?: MutableRefObject<
    ((progress: number, immediate?: boolean) => void) | null
  >;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const dials = useDialKit(
    'Gallery Warp',
    {
      model: {
        preset: [0, 0, 3, 1],
      },
      optics: {
        edge: [0.08, 0.04, 0.55, 0.01],
        bend: [1.18, 0.08, 1.45, 0.01],
        lift: [0.5, 0.1, 1.4, 0.01],
        bow: [0.09, 0, 0.6, 0.01],
        power: [1.55, 0.5, 2.5, 0.05],
        overscan: [0.03, 0, 0.4, 0.01],
      },
    },
    { id: 'gallery-warp-v3', persist: true },
  );
  const dialsRef = useRef(dials);
  dialsRef.current = dials;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    const fallback = document.createElement('canvas');
    for (const el of [canvas, fallback]) {
      el.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
      el.setAttribute('aria-hidden', 'true');
    }
    fallback.style.pointerEvents = 'none';
    host.append(fallback, canvas);

    const strip = document.createElement('canvas');
    const stripCtx = strip.getContext('2d');
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });

    let prog: WebGLProgram | null = null;
    let tex: WebGLTexture | null = null;
    let uResolution: WebGLUniformLocation | null = null;
    let uEdgeWidth: WebGLUniformLocation | null = null;
    let uBend: WebGLUniformLocation | null = null;
    let uLift: WebGLUniformLocation | null = null;
    let uBow: WebGLUniformLocation | null = null;
    let uPadX: WebGLUniformLocation | null = null;
    let uPadY: WebGLUniformLocation | null = null;
    let uWarpLeft: WebGLUniformLocation | null = null;
    let uPower: WebGLUniformLocation | null = null;
    let uOverscan: WebGLUniformLocation | null = null;
    let uModel: WebGLUniformLocation | null = null;
    let posBuf: WebGLBuffer | null = null;
    let uvBuf: WebGLBuffer | null = null;
    let hasGL = false;

    if (gl) {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (vs && fs) {
        prog = gl.createProgram();
        if (prog) {
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs);
          gl.linkProgram(prog);
          if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            hasGL = true;
            gl.useProgram(prog);
            const verts = new Float32Array([
              -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
            ]);
            const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
            posBuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            const aPos = gl.getAttribLocation(prog, 'position');
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
            uvBuf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
            gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
            const aUv = gl.getAttribLocation(prog, 'uv');
            gl.enableVertexAttribArray(aUv);
            gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
            gl.uniform1i(gl.getUniformLocation(prog, 'tDiffuse'), 0);
            uResolution = gl.getUniformLocation(prog, 'uResolution');
            uEdgeWidth = gl.getUniformLocation(prog, 'uEdgeWidth');
            uBend = gl.getUniformLocation(prog, 'uBend');
            uLift = gl.getUniformLocation(prog, 'uLift');
            uBow = gl.getUniformLocation(prog, 'uBow');
            uPadX = gl.getUniformLocation(prog, 'uPadX');
            uPadY = gl.getUniformLocation(prog, 'uPadY');
            uWarpLeft = gl.getUniformLocation(prog, 'uWarpLeft');
            uPower = gl.getUniformLocation(prog, 'uPower');
            uOverscan = gl.getUniformLocation(prog, 'uOverscan');
            uModel = gl.getUniformLocation(prog, 'uModel');
            tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          }
        }
      }
    }

    canvas.style.opacity = hasGL ? '1' : '0';
    fallback.style.opacity = hasGL ? '0' : '1';

    const count = Math.max(1, projects.length);

    let cardW = CARD_W;
    let cardH = CARD_H;
    let itemWidth = cardW + GAP;

    let vw = 1;
    let vh = 1;
    let dpr = 1;
    let padX = 0;
    let padY = 0;
    let stripW = 1;
    let stripH = 1;
    let scrollX = 0;
    let targetX = 0;
    let alignOffset = 0;
    const warp = 1;
    let layoutReady = false;
    let snapAnim: { stop: () => void } | null = null;
    let wheelTimer = 0;

    const stopSnap = () => {
      snapAnim?.stop();
      snapAnim = null;
    };

    const loop = () => count * itemWidth;

    const wrapToLoop = (x: number) => {
      const total = loop();
      if (total <= 0) return x;
      let base = x + alignOffset;
      base = ((base % total) + total) % total;
      return base - alignOffset;
    };

    const snapTo = (next: number) => {
      targetX = next;
      const from = scrollX;
      stopSnap();
      snapAnim = animate(from, next, {
        type: 'tween' as const,
        duration: 0.5,
        ease: [0, 0, 0.58, 1] as [number, number, number, number],
        onUpdate: (v) => {
          scrollX = v;
        },
        onComplete: () => {
          snapAnim = null;
          scrollX = wrapToLoop(scrollX);
          targetX = wrapToLoop(targetX);
        },
      });
    };

    const nearestTarget = () => {
      const current = Math.round((targetX + alignOffset) / itemWidth);
      return current * itemWidth - alignOffset;
    };

    const settle = () => {
      snapTo(nearestTarget());
    };

    const wrappedIndex = (x: number) => {
      const frac = (x + alignOffset) / itemWidth;
      return ((frac % count) + count) % count;
    };

    if (seekRef) {
      seekRef.current = (progress: number, immediate?: boolean) => {
        const next = progress * count * itemWidth - alignOffset;
        if (immediate) {
          stopSnap();
          scrollX = next;
          targetX = next;
          return;
        }
        snapTo(next);
      };
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = Math.max(1, host.clientWidth);
      vh = Math.max(1, host.clientHeight);
      cardW = CARD_W;
      cardH = CARD_H;
      itemWidth = cardW + GAP;
      padX = Math.max(vw * 0.32, cardW * 0.6);
      padY = Math.max(MAX_FLARE_TOP, MAX_FLARE_BOTTOM, vh * PAD_Y);
      stripW = vw + padX * 2;
      stripH = vh + padY * 2;
      alignOffset = (vw - cardW) / 2;
      const dw = Math.round(vw * dpr);
      const dh = Math.round(vh * dpr);
      canvas.width = dw;
      canvas.height = dh;
      fallback.width = dw;
      fallback.height = dh;
      strip.width = Math.round(stripW * dpr);
      strip.height = Math.round(stripH * dpr);
      if (gl && hasGL) gl.viewport(0, 0, dw, dh);
      if (!layoutReady) {
        scrollX = -alignOffset;
        targetX = scrollX;
        layoutReady = true;
      } else {
        targetX = wrapToLoop(nearestTarget());
        scrollX = targetX;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const drag = {
      active: false,
      id: -1,
      last: 0,
      x0: 0,
      y0: 0,
      click: true,
    };

    const onDown = (e: PointerEvent) => {
      drag.active = true;
      stopSnap();
      drag.id = e.pointerId;
      drag.last = e.clientX;
      drag.x0 = e.clientX;
      drag.y0 = e.clientY;
      drag.click = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.active || e.pointerId !== drag.id) return;
      targetX -= (e.clientX - drag.last) * DRAG_GAIN;
      drag.last = e.clientX;
      if (
        Math.abs(e.clientX - drag.x0) > CLICK_SLOP ||
        Math.abs(e.clientY - drag.y0) > CLICK_SLOP
      ) {
        drag.click = false;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.active || e.pointerId !== drag.id) return;
      drag.active = false;
      if (!count || itemWidth <= 0) return;
      const current = Math.round((targetX + alignOffset) / itemWidth);
      if (drag.click) {
        const rect = host.getBoundingClientRect();
        const steps = Math.round(
          (e.clientX - rect.left - alignOffset - cardW / 2) / itemWidth,
        );
        snapTo((current + steps) * itemWidth - alignOffset);
      } else {
        snapTo(current * itemWidth - alignOffset);
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopSnap();
      targetX += e.deltaY + e.deltaX;
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(settle, 180);
    };

    host.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    host.addEventListener('wheel', onWheel, { passive: false });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (drag.active) {
        scrollX = targetX;
      } else if (!snapAnim) {
        const lf = 1 - Math.pow(1 - DAMPING, dt * 60);
        scrollX += (targetX - scrollX) * lf;
        const wrapped = wrapToLoop(scrollX);
        if (Math.abs(wrapped - scrollX) > 0.5) {
          targetX += wrapped - scrollX;
          scrollX = wrapped;
        }
      }

      const frac = wrappedIndex(scrollX);
      const index = ((Math.round(frac) % count) + count) % count;
      onProgressRef.current?.(frac / count, index);

      const d = dialsRef.current;
      if (stripCtx) {
        stripCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        stripCtx.clearRect(0, 0, stripW, stripH);
        const y = padY + MAX_FLARE_TOP;
        const leftBound = -padX - vw;
        const rightBound = vw + padX * 2;
        const edge = Math.max(d.optics.edge, 0.001);
        const alpha = Math.min(1.45, Math.max(0.08, d.optics.bend));
        const power = Math.max(d.optics.power, 0.4);
        const overscan = d.optics.overscan;
        const tanA = Math.max(Math.tan(alpha), 1e-4);
        const mapSx = (sx: number) => {
          if (vw <= 0 || sx <= 0 || sx >= 1) return sx * vw;
          const sRight = Math.min(1, Math.max(0, (sx - (1 - edge)) / edge));
          const sLeft =
            Math.min(1, Math.max(0, (edge - sx) / edge)) * warp;
          const cyl = (s: number, side: number) => {
            const unroll = Math.tan(Math.pow(s, power) * alpha) / tanA;
            return side > 0
              ? 1 - edge + unroll * (edge + overscan)
              : edge - unroll * (edge + overscan);
          };
          let src = sx;
          if (sRight > 0) src = cyl(sRight, 1);
          if (sLeft > 0) src = cyl(sLeft, -1);
          return src * vw;
        };
        const startN = Math.floor((scrollX - padX - vw) / itemWidth) - 1;
        const endN = Math.ceil((scrollX + vw + padX) / itemWidth) + 1;
        for (let n = startN; n <= endN; n++) {
          const screenL = -scrollX + n * itemWidth;
          const screenR = screenL + cardW;
          const x0 = mapSx(screenL / vw);
          const w = mapSx(screenR / vw) - x0;
          if (w <= 0.5) continue;
          if (x0 + w > leftBound && x0 < rightBound) {
            drawBox(stripCtx, padX + x0, y, w, cardH, CARD_RADIUS);
          }
        }
      }

      if (gl && hasGL && tex && stripCtx) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          strip,
        );
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uEdgeWidth, d.optics.edge);
        gl.uniform1f(uBend, d.optics.bend);
        gl.uniform1f(uLift, d.optics.lift);
        gl.uniform1f(uBow, d.optics.bow);
        gl.uniform1f(uPadX, padX / stripW);
        gl.uniform1f(uPadY, padY / stripH);
        gl.uniform1f(uWarpLeft, warp);
        gl.uniform1f(uPower, d.optics.power);
        gl.uniform1f(uOverscan, d.optics.overscan);
        gl.uniform1f(uModel, d.model.preset);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        const fb = fallback.getContext('2d');
        if (fb) {
          fb.setTransform(1, 0, 0, 1, 0, 0);
          fb.clearRect(0, 0, fallback.width, fallback.height);
          fb.drawImage(
            strip,
            padX * dpr,
            padY * dpr,
            vw * dpr,
            vh * dpr,
            0,
            0,
            fallback.width,
            fallback.height,
          );
        }
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      stopSnap();
      window.clearTimeout(wheelTimer);
      ro.disconnect();
      host.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      host.removeEventListener('wheel', onWheel);
      if (gl && hasGL) {
        if (tex) gl.deleteTexture(tex);
        if (posBuf) gl.deleteBuffer(posBuf);
        if (uvBuf) gl.deleteBuffer(uvBuf);
        if (prog) gl.deleteProgram(prog);
      }
      canvas.remove();
      fallback.remove();
      if (seekRef) seekRef.current = null;
    };
  }, [projects]);

  return (
    <div
      ref={hostRef}
      className="relative h-full min-h-0 w-full cursor-grab touch-none overflow-hidden active:cursor-grabbing"
      style={{ isolation: 'isolate' }}
    >
      <div className="sr-only">
        {projects.map((project) => (
          <a key={project.image} href={project.href}>
            {project.title}
          </a>
        ))}
      </div>
    </div>
  );
}
