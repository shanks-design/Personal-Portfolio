'use client';

/**
 * GlassOverIframeButton — real liquid glass over a same-origin iframe.
 *
 * Captures the iframe pixels under the button into a blob image and passes that
 * as `refract` to GlassButton so the SVG displacement bends live content.
 * Do not use frost here; that would be a blur, not glass.
 */

import {
  CSSProperties,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { GlassButton } from './GlassButton';
import { captureIframeRegion } from './captureIframeRegion';

export interface GlassOverIframeButtonProps {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
  /** Absolute position within the iframe host (parent is position:relative). */
  style?: CSSProperties;
  className?: string;
  contentClassName?: string;
  width?: number;
  height?: number;
  /** When true, listen for pb-canvas:frame from this iframe's contentWindow. */
  listenForFrames?: boolean;
  radius?: number | 'pill';
  scale?: number;
  strength?: number;
  chroma?: number;
  rim?: number;
  depth?: number;
  blur?: number;
  tint?: string;
  curvature?: number;
  splay?: number;
  glow?: number;
  specularAngle?: number;
  borderWidth?: number;
  borderAngle?: number;
  borderColorStart?: string;
  borderColorMiddle?: string;
  borderColorEnd?: string;
  borderOpacityStart?: number;
  borderOpacityMiddle?: number;
  borderOpacityEnd?: number;
  borderMiddleStop?: number;
}

export function GlassOverIframeButton({
  iframeRef,
  children,
  onClick,
  ariaLabel,
  title,
  style,
  className,
  contentClassName = 'text-white/90',
  width = 40,
  height = 40,
  listenForFrames = true,
  radius = 'pill',
  scale = 8,
  strength,
  chroma = 0.16,
  rim = 0.95,
  depth = 0.22,
  blur = 0,
  tint = 'rgba(0,0,0,0.42)',
  curvature = 0.4,
  splay = 1,
  glow = 0.1,
  specularAngle = 45,
  borderWidth = 1,
  borderAngle = 135,
  borderColorStart = '#ffffff',
  borderColorMiddle = '#ffffff',
  borderColorEnd = '#ffffff',
  borderOpacityStart = 0.55,
  borderOpacityMiddle = 0.4,
  borderOpacityEnd = 0.2,
  borderMiddleStop = 0.5,
}: GlassOverIframeButtonProps) {
  const [refractUrl, setRefractUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const buttonRef = useRef<HTMLElement | null>(null);
  const pendingRef = useRef(false);
  const capturingRef = useRef(false);
  const rafRef = useRef(0);
  const lastCaptureAt = useRef(0);

  const capture = useCallback(async () => {
    const iframe = iframeRef.current;
    const button = buttonRef.current;
    if (!iframe || !button) return;

    const now = performance.now();
    if (now - lastCaptureAt.current < 48) {
      pendingRef.current = true;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        void capture();
      });
      return;
    }

    if (capturingRef.current) {
      pendingRef.current = true;
      return;
    }

    const iframeRect = iframe.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const left = buttonRect.left - iframeRect.left;
    const top = buttonRect.top - iframeRect.top;
    const w = buttonRect.width || width;
    const h = buttonRect.height || height;

    capturingRef.current = true;
    lastCaptureAt.current = now;
    try {
      const next = await captureIframeRegion(iframe, {
        left,
        top,
        width: w,
        height: h,
      });
      if (!next) return;

      const prev = urlRef.current;
      urlRef.current = next;
      setRefractUrl(next);
      if (prev) {
        requestAnimationFrame(() => URL.revokeObjectURL(prev));
      }
    } finally {
      capturingRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        rafRef.current = requestAnimationFrame(() => {
          void capture();
        });
      }
    }
  }, [iframeRef, width, height]);

  const scheduleCapture = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      void capture();
    });
  }, [capture]);

  useLayoutEffect(() => {
    scheduleCapture();
  }, [scheduleCapture]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const onLoad = () => scheduleCapture();
    iframe?.addEventListener('load', onLoad);

    const onMessage = (e: MessageEvent) => {
      if (!listenForFrames) return;
      if (!e.data || e.data.type !== 'pb-canvas:frame') return;
      if (iframe && e.source && e.source !== iframe.contentWindow) return;
      scheduleCapture();
    };
    window.addEventListener('message', onMessage);

    const ro = new ResizeObserver(() => scheduleCapture());
    if (buttonRef.current) ro.observe(buttonRef.current);
    if (iframe) ro.observe(iframe);

    // Cards may load after first paint — refresh a couple times
    const t1 = window.setTimeout(scheduleCapture, 300);
    const t2 = window.setTimeout(scheduleCapture, 1000);

    return () => {
      iframe?.removeEventListener('load', onLoad);
      window.removeEventListener('message', onMessage);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [iframeRef, listenForFrames, scheduleCapture]);

  const refract = refractUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- blob URL from canvas capture
    <img
      src={refractUrl}
      alt=""
      draggable={false}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
      }}
    />
  ) : (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          '#000000',
      }}
    />
  );

  return (
    <GlassButton
      ref={buttonRef}
      radius={radius}
      scale={scale}
      strength={strength}
      chroma={chroma}
      rim={rim}
      depth={depth}
      blur={blur}
      tint={tint}
      curvature={curvature}
      splay={splay}
      glow={glow}
      specularAngle={specularAngle}
      borderWidth={borderWidth}
      borderAngle={borderAngle}
      borderColorStart={borderColorStart}
      borderColorMiddle={borderColorMiddle}
      borderColorEnd={borderColorEnd}
      borderOpacityStart={borderOpacityStart}
      borderOpacityMiddle={borderOpacityMiddle}
      borderOpacityEnd={borderOpacityEnd}
      borderMiddleStop={borderMiddleStop}
      ariaLabel={ariaLabel}
      title={title}
      onClick={onClick}
      className={className}
      contentClassName={contentClassName}
      refract={refract}
      style={{
        width,
        height,
        cursor: 'none',
        ...style,
      }}
    >
      {children}
    </GlassButton>
  );
}
