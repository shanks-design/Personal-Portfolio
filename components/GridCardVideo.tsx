'use client';

import { useEffect, useRef, useState } from 'react';

type GridCardVideoProps = {
  src: string;
  srcWebm?: string;
  poster: string;
  label: string;
  startOffset?: number;
};

const reducedQuery = '(prefers-reduced-motion: reduce)';

export default function GridCardVideo({
  src,
  srcWebm,
  poster,
  label,
  startOffset = 0,
}: GridCardVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const reduced = window.matchMedia(reducedQuery);
    let observer: IntersectionObserver | undefined;

    const waitForMetadata = () =>
      video.readyState >= 1
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            video.addEventListener('loadedmetadata', () => resolve(), { once: true });
          });

    const playVideo = async () => {
      if (reduced.matches) return;
      if (!startedRef.current && startOffset > 0) {
        await waitForMetadata();
        if (!startedRef.current) video.currentTime = startOffset;
      }
      try {
        await video.play();
        startedRef.current = true;
      } catch {
        /* keep poster until playing fires */
      }
    };

    const pauseVideo = () => {
      video.pause();
    };

    const setup = () => {
      observer?.disconnect();
      observer = undefined;
      pauseVideo();
      if (reduced.matches) {
        setRevealed(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (reduced.matches) {
            pauseVideo();
            setRevealed(false);
            return;
          }
          if (entry.isIntersecting) void playVideo();
          else pauseVideo();
        },
        { threshold: 0.5 },
      );
      observer.observe(wrap);
    };

    const onPlaying = () => setRevealed(true);

    video.addEventListener('playing', onPlaying);
    setup();
    reduced.addEventListener('change', setup);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener('change', setup);
      video.removeEventListener('playing', onPlaying);
      pauseVideo();
    };
  }, [startOffset]);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- static poster under the video */}
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={videoRef}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className={`relative h-full w-full object-cover transition-opacity duration-500 ${
          revealed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {srcWebm ? <source src={srcWebm} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
