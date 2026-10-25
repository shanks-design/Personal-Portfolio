import GridCard, { type GridCardData } from '@/components/GridCard';
import GridToggle from '@/components/GridToggle';

const CARDS: readonly GridCardData[] = [
  {
    title: 'Base App',
    company: 'Coinbase',
    placement: 'col-span-6 col-start-1',
    video: '/projects/base-app.mp4',
    poster: '/projects/base-app.webp?v=2',
  },
  {
    title: 'Anuma',
    company: 'Anuma AI',
    placement: 'col-span-6 col-start-7',
    video: '/projects/anuma.mp4',
    videoWebm: '/projects/anuma.webm',
    poster: '/projects/anuma.webp?v=2',
  },
];

const LINKS = [
  { label: 'Resume', href: '#' },
  { label: 'Linkedin', href: '#' },
  { label: 'Bookmarks', href: '#' },
] as const;

export default function GridSimplePage() {
  return (
    <main className="grid-fold flex min-h-dvh flex-col bg-[#FCFCFC] pb-u0_5 font-haas-text text-body text-[#202020] antialiased">
      <header className="grid-site pt-u1 leading-u1">
        <GridToggle className="col-span-3 justify-self-start">[AS]</GridToggle>
        <nav className="col-span-3 col-start-7 grid grid-cols-subgrid">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href} className="justify-self-start transition-opacity hover:opacity-50">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#" aria-label="Email" className="col-start-12 justify-self-end transition-opacity hover:opacity-50">
          [<span className="font-inter-variable">→</span>] Email
        </a>
      </header>

      <section className="grid-site mt-[calc(var(--px)*193.5)] items-start font-haas-display">
        <p className="col-span-6 mt-[calc(var(--px)*39.25)] text-[calc(var(--px)*38)] font-semibold leading-[calc(var(--px)*39.25)]">
          Atharva
          <br />
          <span className="text-[#767676]">Product designer</span>
        </p>
        <h1 className="col-span-6 col-start-7 text-[calc(var(--px)*38)] font-semibold leading-[calc(var(--px)*39.25)]">
          Founding designer based in SF. Currently <span className="font-bold">@</span>Anuma AI. Previously{' '}
          <span className="font-bold">@</span>Coinbase, NFT&nbsp;Labs, and Pineapple Design.
        </h1>
      </section>

      <section className="grid-site mb-u2 mt-auto pt-u2">
        {CARDS.map((card) => (
          <GridCard key={card.placement} height="h-u16" caption="inline" {...card} />
        ))}
      </section>
    </main>
  );
}
