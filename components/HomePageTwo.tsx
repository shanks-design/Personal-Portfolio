'use client';

import Gallery3D, {
  GALLERY_CARD_H,
  GALLERY_FLARE_BOTTOM,
  GALLERY_FLARE_TOP,
} from '@/components/Gallery3D';
import LineMinimap from '@/components/LineMinimap';
import SfLocation from '@/components/SfLocation';
import { useMotionValue, useMotionValueEvent } from 'motion/react';
import { useRef, useState } from 'react';

const PROJECTS = [
  {
    title: 'Coinbase',
    meta: 'coinbase · 2025',
    href: '#',
    image: '/projects/verifications.png',
  },
  {
    title: 'Base',
    meta: 'coinbase · 2025',
    href: '#',
    image: '/projects/cult-up.png',
  },
  {
    title: 'NFT Labs',
    meta: 'coinbase · 2025',
    href: '#',
    image: '/projects/nft-claim-wide.jpg',
  },
  {
    title: 'Anuma',
    meta: 'coinbase · 2025',
    href: '#',
    image: '/projects/coinbase-verifications.png',
  },
] as const;

export default function HomePageTwo() {
  const progress = useMotionValue(0);
  const seekRef = useRef<((next: number, immediate?: boolean) => void) | null>(
    null,
  );
  const [index, setIndex] = useState(0);

  useMotionValueEvent(progress, 'change', (latest) => {
    const count = PROJECTS.length;
    const next = ((Math.round(latest * count) % count) + count) % count;
    setIndex((current) => (current === next ? current : next));
  });

  return (
    <main className="rem-page bg-[#FCFCFC] font-runde text-[#202020] antialiased selection:bg-[#202020] selection:text-white">
      <section className="relative h-dvh overflow-x-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-[1800px] flex-col px-[24px] pt-[24px]">
          <header className="relative z-20 flex shrink-0 items-start justify-between bg-[#FCFCFC]">
            <p className="meta-text-rem text-left">Atharva</p>
            <SfLocation
              className="meta-text-rem text-right"
              iconSize={20}
              variant="inline"
            />
          </header>

          <div className="relative z-20 shrink-0 pt-[72px] pb-[72px] text-center">
            <h1 className="font-runde text-[32px] font-medium leading-[47px] tracking-[-0.03em] text-[#202020]">
              Founding designer{' '}
              <a
                href="https://anuma.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-50"
              >
                @anuma
              </a>
            </h1>
            <p className="mx-auto mt-[6px] w-[292px] font-runde text-[20px] font-normal leading-[28px] tracking-[-0.02em] text-[#202020]">
              previously @coinbase, nft labs, pineapple design.
            </p>
          </div>

          <div
            className="relative z-0 w-screen shrink-0 overflow-visible"
            style={{
              marginLeft: 'calc(50% - 50vw)',
              marginTop: -GALLERY_FLARE_TOP,
              height:
                GALLERY_FLARE_TOP + GALLERY_CARD_H + GALLERY_FLARE_BOTTOM,
            }}
          >
            <Gallery3D
              projects={PROJECTS}
              onProgress={(next) => progress.set(next)}
              seekRef={seekRef}
            />
          </div>

          <div
            className="relative z-20 flex shrink-0 justify-center"
            style={{ marginTop: 48 - GALLERY_FLARE_BOTTOM }}
          >
            <LineMinimap
              progress={progress}
              labels={PROJECTS.map((project) => project.title)}
              activeIndex={index}
              onScrub={(next) => seekRef.current?.(next, true)}
              onSeek={(next) => seekRef.current?.(next)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
