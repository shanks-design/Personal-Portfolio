'use client';

import SfLocation from '@/components/SfLocation';
import ThumbRail from '@/components/ThumbRail';
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

const chrome =
  'font-runde text-[length:var(--fold-pm)] font-normal leading-[1.3em] tracking-[-0.02em] text-[#202020]';

export default function HomePageFold({
  headline = 'one-line',
  weight = 'regular',
}: {
  headline?: 'one-line' | 'two-line';
  weight?: 'regular' | 'medium';
}) {
  const [active, setActive] = useState(3);

  return (
    <main className="fold-page relative h-dvh overflow-hidden bg-white font-runde text-[#202020] antialiased selection:bg-[#202020] selection:text-white">
      <ThumbRail
        projects={PROJECTS}
        active={active}
        onActiveChange={setActive}
        captionClassName={chrome}
      />

      <div
        className="pointer-events-none relative z-10 grid h-full"
        style={{
          padding: 'calc(var(--fold-margin) * 0.75) var(--fold-margin) var(--fold-margin)',
          gridTemplateColumns: 'repeat(5, var(--fold-col))',
          columnGap: 'var(--fold-gutter)',
          gridTemplateRows: 'auto minmax(0, 1fr)',
        }}
      >
        <p className={`${chrome} col-start-1 self-center`}>Atharva</p>

        <a
          href="#about"
          className={`${chrome} pointer-events-auto col-start-2 self-center transition-opacity hover:opacity-50`}
        >
          About
        </a>

        <a
          href="mailto:hello@atharva.cc"
          className={`${chrome} pointer-events-auto col-start-3 self-center transition-opacity hover:opacity-50`}
        >
          Email
        </a>

        <SfLocation
          className={`${chrome} col-start-5 justify-self-end self-center`}
          iconSize="1em"
          variant="inline"
        />

        <section className="pointer-events-auto col-span-4 col-start-2 row-start-2 mt-[calc(var(--fold-margin)*3)] flex min-h-0 flex-col">
          <div
            className="flex shrink-0 items-end justify-between gap-[var(--fold-gutter)] pb-[length:var(--fold-margin)]"
            style={{ alignItems: 'last baseline' }}
          >
            <h1
              className={`${weight === 'medium' ? 'font-medium tracking-[-0.02em]' : 'font-normal tracking-[-0.025em]'} text-[#202020]`}
              style={{
                fontSize: 'var(--fold-headline)',
                lineHeight: weight === 'medium' ? 1.05 : 1.1,
              }}
            >
              {headline === 'two-line' ? (
                <>
                  Software designer
                  <br />
                  making AI products.
                </>
              ) : (
                'Software designer making AI products.'
              )}
            </h1>
            <p
              className={`${chrome} shrink-0 text-right`}
              style={{ width: 'var(--fold-col)' }}
            >
              previously @
              <br />
              coinbase, nft labs,
              <br />
              pineapple design.
            </p>
          </div>
          <div
            className="min-h-0 flex-1 bg-[#E8E8E8]"
            role="img"
            aria-label={`${PROJECTS[active].title} preview`}
          />
        </section>
      </div>
    </main>
  );
}
