'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const morphTime = 1.2;
const cooldownTime = 2.5;

export interface MorphPhrase {
  text: string;
  emoji?: string;
  /** Horizontal nudge (px) for the emoji to fine-tune spacing per phrase */
  emojiNudge?: number;
}

const useMorphingText = (phrases: MorphPhrase[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(cooldownTime);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const emoji1Ref = useRef<HTMLSpanElement>(null);
  const emoji2Ref = useRef<HTMLSpanElement>(null);
  const textBoxRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const widthsRef = useRef<number[]>([]);

  const setBoxWidth = useCallback((width: number) => {
    if (textBoxRef.current) textBoxRef.current.style.width = `${width}px`;
  }, []);

  const setStyles = useCallback(
    (fraction: number) => {
      const current1 = text1Ref.current;
      const current2 = text2Ref.current;
      const e1 = emoji1Ref.current;
      const e2 = emoji2Ref.current;
      if (!current1 || !current2) return;

      const invertedFraction = 1 - fraction;
      const opIn = `${Math.pow(fraction, 0.4) * 100}%`;
      const opOut = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      if (textBoxRef.current) {
        textBoxRef.current.style.filter = 'url(#morph-threshold) blur(0.6px)';
      }

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = opIn;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = opOut;

      const i = textIndexRef.current % phrases.length;
      const next = (textIndexRef.current + 1) % phrases.length;
      current1.textContent = phrases[i].text;
      current2.textContent = phrases[next].text;

      const widths = widthsRef.current;
      if (widths.length) {
        setBoxWidth(widths[i] + (widths[next] - widths[i]) * fraction);
      }

      if (e1 && e2) {
        e2.style.filter = `blur(${Math.min(5 / fraction - 5, 40)}px)`;
        e2.style.opacity = opIn;
        e1.style.filter = `blur(${Math.min(5 / invertedFraction - 5, 40)}px)`;
        e1.style.opacity = opOut;
        e1.textContent = phrases[i].emoji ?? '';
        e2.textContent = phrases[next].emoji ?? '';
        e1.style.transform = `translateX(${phrases[i].emojiNudge ?? 0}px)`;
        e2.style.transform = `translateX(${phrases[next].emojiNudge ?? 0}px)`;
      }
    },
    [phrases, setBoxWidth],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const settle = (a: HTMLSpanElement | null, b: HTMLSpanElement | null) => {
      if (!a || !b) return;
      b.style.filter = 'none';
      b.style.opacity = '100%';
      a.style.filter = 'none';
      a.style.opacity = '0%';
    };
    settle(text1Ref.current, text2Ref.current);
    settle(emoji1Ref.current, emoji2Ref.current);

    // Drop the gooey threshold/blur at rest so the settled text is crisp
    if (textBoxRef.current) textBoxRef.current.style.filter = 'none';

    const widths = widthsRef.current;
    if (widths.length) {
      setBoxWidth(widths[textIndexRef.current % widths.length]);
    }
  }, [setBoxWidth]);

  useEffect(() => {
    if (measureRef.current) {
      widthsRef.current = Array.from(measureRef.current.children).map(
        (c) => (c as HTMLElement).offsetWidth,
      );
      if (widthsRef.current.length) setBoxWidth(widthsRef.current[0]);
    }

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown, setBoxWidth]);

  return { text1Ref, text2Ref, emoji1Ref, emoji2Ref, textBoxRef, measureRef };
};

interface MorphingTextProps {
  className?: string;
  phrases: MorphPhrase[];
}

const SvgFilters: React.FC = () => (
  <svg className="fixed h-0 w-0" aria-hidden preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="morph-threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

export const MorphingText: React.FC<MorphingTextProps> = ({ phrases, className }) => {
  const { text1Ref, text2Ref, emoji1Ref, emoji2Ref, textBoxRef, measureRef } =
    useMorphingText(phrases);
  const hasEmoji = phrases.some((p) => p.emoji);

  return (
    <span className={cn('relative inline-flex items-center gap-4', className)}>
      {/* Text: gooey threshold morph; box width tracks the current phrase */}
      <span ref={textBoxRef} className="relative inline-block">
        <span ref={measureRef} className="invisible" style={{ display: 'inline-grid' }} aria-hidden>
          {phrases.map((p, i) => (
            <span
              key={i}
              className="whitespace-nowrap"
              style={{ gridArea: '1 / 1', justifySelf: 'start' }}
            >
              {p.text}
            </span>
          ))}
        </span>
        <span className="absolute inset-0 inline-block w-full whitespace-nowrap" ref={text1Ref}>
          {phrases[0].text}
        </span>
        <span
          className="absolute inset-0 inline-block w-full whitespace-nowrap"
          ref={text2Ref}
          style={{ opacity: 0 }}
        >
          {phrases[1]?.text ?? phrases[0].text}
        </span>
      </span>

      {/* Emoji: clean blur crossfade morph (no threshold) */}
      {hasEmoji && (
        <span className="relative inline-block">
          <span className="invisible" style={{ display: 'inline-grid' }} aria-hidden>
            {phrases.map((p, i) => (
              <span key={i} style={{ gridArea: '1 / 1' }}>
                {p.emoji ?? ''}
              </span>
            ))}
          </span>
          <span
            className="absolute inset-0 inline-block w-full"
            ref={emoji1Ref}
            style={{ transform: `translateX(${phrases[0].emojiNudge ?? 0}px)` }}
          >
            {phrases[0].emoji ?? ''}
          </span>
          <span
            className="absolute inset-0 inline-block w-full"
            ref={emoji2Ref}
            style={{ opacity: 0, transform: `translateX(${phrases[1]?.emojiNudge ?? 0}px)` }}
          >
            {phrases[1]?.emoji ?? phrases[0].emoji ?? ''}
          </span>
        </span>
      )}

      <SvgFilters />
    </span>
  );
};

export default MorphingText;
