'use client';

import { useEffect, useRef, useState } from 'react';

type GridCardVideoProps = {
  src: string;
  srcWebm?: string;
  poster: string;
  label: string;
};

const hoverQuery = '(hover: hover) and (pointer: fine)';
const reducedQuery = '(prefers-reduced-motion: reduce)';

export default function GridCardVideo({ src, srcWebm, poster, label }: GridCardVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const pauseToPoster = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia(reducedQuery);
    const hover = window.matchMedia(hoverQuery);
    let observer: IntersectionObserver | undefined;

    const setup = () => {
      observer?.disconnect();
      observer = undefined;
      pauseToPoster();
      if (reduced.matches || hover.matches) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (reduced.matches) {
            pauseToPoster();
            return;
          }
          if (entry.isIntersecting) playVideo();
          else pauseToPoster();
        },
        { threshold: 0.5 },
      );
      observer.observe(video);
    };

    setup();
    reduced.addEventListener('change', setup);
    hover.addEventListener('change', setup);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener('change', setup);
      hover.removeEventListener('change', setup);
      pauseToPoster();
    };
  }, []);

  const onMouseEnter = () => {
    if (window.matchMedia(reducedQuery).matches) return;
    if (!window.matchMedia(hoverQuery).matches) return;
    playVideo();
  };

  const onMouseLeave = () => {
    if (!window.matchMedia(hoverQuery).matches) return;
    pauseToPoster();
  };

  return (
    <div className="relative h-full w-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
        className={`relative h-full w-full object-cover ${playing ? 'opacity-100' : 'opacity-0'}`}
      >
        {srcWebm ? <source src={srcWebm} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
