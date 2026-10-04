'use client';

import SfLocation from '@/components/SfLocation';
import ThumbRail, { type RailMetrics } from '@/components/ThumbRail';
import { useState } from 'react';

const PROJECTS = [
  { title: 'Coinbase', subtitle: 'Onchain' },
  { title: 'Base', subtitle: 'Launch' },
  { title: 'NFT Labs', subtitle: 'Marketplace' },
  { title: 'Base App', subtitle: 'Base App' },
  { title: 'Anuma', subtitle: 'Product' },
  { title: 'Wallet', subtitle: 'Identity' },
  { title: 'Gallery', subtitle: 'Personal' },
] as const;

const RAIL: RailMetrics = {
  thumb: 48,
  pitch: 118,
  x: 4,
  captionGap: 11,
  openInset: 0,
  activeShift: 4,
  radius: 4,
  subtitleColor: '#707070',
};

const LEFT_COL = 323;
const RIGHT_COL = 184;

export default function HomePageFigma() {
  const [active, setActive] = useState(3);

  return (
    <main className="fold-page h-dvh overflow-hidden bg-[#FCFCFC] font-runde text-[#202020] antialiased selection:bg-[#202020] selection:text-white">
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-[24px] pb-[24px]">
        <ThumbRail
          projects={PROJECTS}
          active={active}
          onActiveChange={setActive}
          captionClassName="font-runde text-[14px] font-normal leading-[20px] tracking-[0] text-[#202020]"
          metrics={RAIL}
          style={{ left: 20, width: LEFT_COL - 20 }}
        />

        <header
          className="flex shrink-0 pt-[22px] text-[20px] leading-[24px]"
          style={{ marginLeft: LEFT_COL }}
        >
          <div className="flex flex-1 items-start justify-between">
            <nav className="flex">
              <a href="#about" className="w-[154px] transition-opacity hover:opacity-50">
                About
              </a>
              <a href="mailto:hello@atharva.cc" className="transition-opacity hover:opacity-50">
                [→] Email
              </a>
            </nav>
            <div className="-ml-[2px] shrink-0" style={{ width: RIGHT_COL }}>
              <SfLocation iconSize={20} variant="inline" />
            </div>
          </div>
        </header>

        <section
          className="flex min-h-0 flex-1 flex-col pt-[126px]"
          style={{ marginLeft: LEFT_COL }}
        >
          <div className="flex justify-between" style={{ alignItems: 'last baseline' }}>
            <h1 className="-ml-[2.5px] text-[48px] font-normal leading-[47px] tracking-[-0.042em]">
              Software designer
              <br />
              making AI products.
            </h1>
            <p className="shrink-0 text-[20px] leading-[28px]" style={{ width: RIGHT_COL }}>
              previously @
              <br />
              coinbase, nft labs,
              <br />
              pineapple design.
            </p>
          </div>
          <div
            className="mt-[40px] min-h-0 flex-1 rounded-[10px] bg-[#E8E8E8]"
            role="img"
            aria-label={`${PROJECTS[active].title} preview`}
          />
        </section>
      </div>
    </main>
  );
}
