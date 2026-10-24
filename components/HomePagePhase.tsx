'use client';

import ThumbRail, { type RailMetrics } from '@/components/ThumbRail';
import { Saira, Young_Serif } from 'next/font/google';
import { useState, type CSSProperties } from 'react';

const display = Young_Serif({ subsets: ['latin'], weight: '400' });
const grotesk = Saira({ subsets: ['latin'], weight: ['600'] });

const PROJECTS = [
  { title: 'Coinbase', subtitle: 'Onchain' },
  { title: 'Base', subtitle: 'Launch' },
  { title: 'NFT Labs', subtitle: 'Marketplace' },
  { title: 'Base App', subtitle: 'Base App' },
  { title: 'Anuma', subtitle: 'Product' },
  { title: 'Wallet', subtitle: 'Identity' },
  { title: 'Gallery', subtitle: 'Personal' },
] as const;

const INK = '#252321';
const PAPER = '#E8E5DE';

const RAIL: RailMetrics = {
  x: 4,
  thumb: 48,
  pitch: 118,
  captionGap: 11,
  openInset: 0,
  activeShift: 4,
  radius: 0,
  subtitleColor: '#7A766F',
  fill: '#D6D2C8',
};

const LINES = [
  { text: 'Software', align: 'self-start', offset: 0 },
  { text: 'designer', align: 'self-end', offset: 0.029 },
  { text: 'making AI', align: 'self-start', offset: 0 },
  { text: 'products.', align: 'self-end', offset: 0.029 },
] as const;

const LEFT_COL = 323;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.15 0 0 0 0 0.14 0 0 0 0 0.13 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function stripes(offset: number): CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 0.032em, transparent 0.032em 0.058em)`,
    backgroundPosition: `${offset}em 0`,
    paddingBlock: '0.35em',
    marginBlock: '-0.35em',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    mixBlendMode: 'multiply',
  };
}

const label = `${grotesk.className} text-[15px] font-semibold uppercase leading-[15px] tracking-[0.01em]`;

export default function HomePagePhase() {
  const [active, setActive] = useState(3);

  return (
    <main
      className="fold-page relative h-dvh overflow-hidden antialiased selection:bg-[#252321] selection:text-[#E8E5DE]"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-[24px] pb-[24px]">
        <ThumbRail
          projects={PROJECTS}
          active={active}
          onActiveChange={setActive}
          captionClassName={`${label} !leading-[17px]`}
          metrics={RAIL}
          style={{ left: 20, width: LEFT_COL - 20 }}
        />

        <header
          className={`${label} grid shrink-0 grid-cols-3 gap-[24px] pt-[24px]`}
          style={{ marginLeft: LEFT_COL }}
        >
          <a href="#about" className="transition-opacity hover:opacity-50">
            About
          </a>
          <a href="mailto:hello@atharva.cc" className="transition-opacity hover:opacity-50">
            [→] Email
          </a>
          <p>
            Based in
            <br />
            San Francisco
          </p>
        </header>

        <section className="flex min-h-0 flex-1 flex-col pt-[56px]" style={{ marginLeft: LEFT_COL }}>
          <div
            className="min-h-0 flex-1 bg-[#D6D2C8]"
            role="img"
            aria-label={`${PROJECTS[active].title} preview`}
          />

          <p className={`${label} relative z-10 mt-[20px]`}>By Atharva Sakharkar</p>

          <h1
            className={`${display.className} relative flex flex-col pt-[0.3em] text-[clamp(64px,8.6vw,124px)] font-normal leading-[0.5] tracking-[-0.04em]`}
          >
            {LINES.map((line) => (
              <span key={line.text} className={line.align} style={stripes(line.offset)}>
                {`${line.text} `}
              </span>
            ))}
          </h1>

          <p className={`${label} mt-[48px] flex justify-between`}>
            {['Previously', '@', 'Coinbase,', 'NFT Labs,', 'Pineapple', 'Design.'].map((word) => (
              <span key={word}>{word}</span>
            ))}
          </p>
        </section>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-50 mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />
    </main>
  );
}
