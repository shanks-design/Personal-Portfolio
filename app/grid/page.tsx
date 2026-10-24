import GridCard, { type GridCardData } from '@/components/GridCard';
import GridToggle from '@/components/GridToggle';

const ROW_ONE: readonly GridCardData[] = [
  { title: 'Base App', company: 'Coinbase', placement: 'col-span-4 col-start-1' },
  { title: 'Base App', company: 'Coinbase', placement: 'col-span-6 col-start-5' },
];

const ROW_TWO: readonly GridCardData[] = [
  { title: 'Onchain', company: 'Coinbase', placement: 'col-span-4 col-start-3' },
  { title: 'Marketplace', company: 'Coinbase', placement: 'col-span-6 col-start-7' },
];

const LINKS = [
  { label: 'Resume', href: '#' },
  { label: 'Linkedin', href: '#' },
  { label: 'Bookmarks', href: '#' },
] as const;

export default function GridPage() {
  return (
    <main className={`min-h-dvh font-haas-text bg-[#FCFCFC] pb-u4 text-body text-[#202020] antialiased`}>
      <header className="grid-site pt-u1 leading-u1">
        <GridToggle className="col-span-3 justify-self-start">[AS]</GridToggle>
        <nav className="col-span-3 col-start-5 grid grid-cols-subgrid">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href} className="justify-self-start transition-opacity hover:opacity-50">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="col-span-3 col-start-10 text-right">San Francisco</p>
      </header>

      <section className="grid-site mt-u4">
        <h1 className="col-span-8 col-start-4 indent-cols-1 font-haas-display text-display font-semibold leading-u2">
          Software designer making AI products at Anuma. Previously at Coinbase, NFT{' '}
          <br className="hidden min-[1400px]:block" />
          labs, and Pineapple studios.
        </h1>
      </section>

      <section className="grid-site mt-u4">
        {ROW_ONE.map((card) => (
          <GridCard key={card.placement} {...card} />
        ))}
      </section>

      <section className="grid-site mt-u3">
        {ROW_TWO.map((card) => (
          <GridCard key={card.placement} {...card} />
        ))}
      </section>
    </main>
  );
}
