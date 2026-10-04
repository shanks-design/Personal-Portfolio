'use client';

import SfLocation from '@/components/SfLocation';
import ThumbRail from '@/components/ThumbRail';
import { useState } from 'react';

const PROJECTS = [
  { title: 'Coinbase', subtitle: 'Onchain', blurb: 'Verifications for a self-custody wallet', tags: ['Product', 'Identity'] },
  { title: 'Base', subtitle: 'Launch', blurb: 'Launch surfaces for an onchain network', tags: ['Web', 'Brand'] },
  { title: 'NFT Labs', subtitle: 'Marketplace', blurb: 'Claim and mint flows for digital collectibles', tags: ['Product', 'Motion'] },
  { title: 'Base App', subtitle: 'Base App', blurb: 'An everything app for the onchain economy', tags: ['Product', 'Mobile'] },
  { title: 'Anuma', subtitle: 'Product', blurb: 'Founding design for an AI-native workspace', tags: ['AI', 'Product', 'Brand'] },
  { title: 'Wallet', subtitle: 'Identity', blurb: 'Making a wallet feel like a profile', tags: ['Product', 'Identity'] },
  { title: 'Gallery', subtitle: 'Personal', blurb: 'Experiments in type, motion, and 3D', tags: ['Motion', 'Web'] },
] as const;

const chrome =
  'font-runde text-[length:var(--fold-pm)] font-normal leading-[1.3em] tracking-[-0.02em] text-[#202020]';
const mono =
  'font-mono text-[10px] uppercase leading-[14px] tracking-[0.02em] text-[#767F8D]';

export default function HomePageSasha() {
  const [active, setActive] = useState(3);
  const project = PROJECTS[active];

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
        <p
          className="col-start-1 leading-none tracking-[-0.02em]"
          style={{ fontSize: 'calc(24 * min(100vw, 1920px) / 1440)' }}
        >
          [AS]
        </p>

        <h1
          className="pointer-events-auto col-span-2 col-start-2 max-w-[18.4em] font-normal text-[#333333]"
          style={{
            fontSize: 'calc(24 * min(100vw, 1920px) / 1440)',
            lineHeight: 1.2,
            letterSpacing: '-0.033em',
          }}
        >
          Atharva Sakharkar is a software designer making AI products at Anuma, previously
          at Coinbase, NFT&nbsp;Labs, and Pineapple.
        </h1>

        <div className="col-start-4 flex items-start gap-[16px]">
          <span className={`${mono} shrink-0 bg-[#F3F3F3] px-[3px]`}>Based in</span>
          <SfLocation className={chrome} iconSize="1em" variant="inline" />
        </div>

        <a
          href="mailto:hello@atharva.cc"
          className={`${chrome} pointer-events-auto col-start-5 justify-self-end transition-opacity hover:opacity-50`}
        >
          [→] Email
        </a>

        <section className="pointer-events-auto col-span-4 col-start-2 row-start-2 mt-[calc(var(--fold-margin)*4)] flex min-h-0 flex-col">
          <div
            className="grid shrink-0 pb-[12px]"
            style={{
              gridTemplateColumns: 'repeat(4, var(--fold-col))',
              columnGap: 'var(--fold-gutter)',
              alignItems: 'baseline',
            }}
          >
            <p className={`${chrome} flex items-baseline gap-[6px]`}>
              {project.title}
              <span className="text-[#8A8A8A]">[{String(active + 1).padStart(2, '0')}]</span>
            </p>
            <p className={`${chrome} col-span-2 !text-[#5C5C5C]`}>{project.blurb}</p>
            <ul className="flex flex-wrap justify-end gap-[6px]">
              {project.tags.map((tag) => (
                <li key={tag} className={`${mono} border border-[#E2E2E2] px-[4px]`}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="min-h-0 flex-1 bg-[#E8E8E8]"
            role="img"
            aria-label={`${project.title} preview`}
          />
        </section>
      </div>
    </main>
  );
}
