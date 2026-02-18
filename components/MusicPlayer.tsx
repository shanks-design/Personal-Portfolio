'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

// Tone arm image may be optional; fallback to CSS
const TONE_ARM_SRC = '/tone-arm.png';

interface MusicPlayerProps {
  audioSrc?: string;
  trackName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MusicPlayer({
  audioSrc = '',
  trackName = 'clickplay.mp3',
  className = '',
  style = {},
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toneArmLoaded, setToneArmLoaded] = useState(true);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 h-full min-h-[515px] ${className}`}
      style={style}
    >
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Body: 237×237px (z-0), then Pin/tone arm (z-10), then Disc (z-20). No transform on body. */}
      <div
        className="relative rounded-[36px] flex items-center justify-center mb-6 overflow-hidden shrink-0"
        style={{ width: 237, height: 237, minWidth: 237, minHeight: 237 }}
      >
        {/* 1. Body - lowest layer */}
        <div className="absolute inset-0 z-0 rounded-[36px] overflow-hidden">
          <Image
            src="/music-player-bg.png"
            alt=""
            fill
            className="object-cover rounded-[36px]"
            sizes="237px"
          />
        </div>
        {/* 2. Pin (tone arm) - middle layer */}
        <div className="absolute inset-0 pointer-events-none flex items-start justify-end pt-0 pr-0 z-10">
          <div
            className="relative origin-[88%_22%]"
            style={{ transform: 'rotate(-30deg)', width: 104, height: 33 }}
          >
            {toneArmLoaded ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={TONE_ARM_SRC}
                alt=""
                className="w-full h-full object-contain object-left block"
                onError={() => setToneArmLoaded(false)}
              />
            ) : (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #9ca3af 15%, #6b7280 50%, #4b5563)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }}
              />
            )}
          </div>
        </div>
        {/* 3. Disc (vinyl) - top layer */}
        <div className="absolute inset-0 flex items-center justify-center translate-x-0.5 translate-y-1 z-20">
          <div
            className="relative w-[152px] h-[152px] rounded-full"
            style={{
              animation: isPlaying ? 'vinyl-spin 2s linear infinite' : 'none',
            }}
          >
            <Image
              src="/vinyl.png"
              alt=""
              width={152}
              height={152}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Track name */}
      <p className="text-white text-lg font-medium mb-6 tracking-tight">{trackName}</p>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => {}}
          className="p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <SkipBack size={24} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex items-center justify-center"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={28} strokeWidth={2} /> : <Play size={28} strokeWidth={2} className="ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Next"
        >
          <SkipForward size={24} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
