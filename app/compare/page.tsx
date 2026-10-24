import LayoutPreview from '@/components/LayoutPreview';

const LIVE = [
  {
    step: '01',
    title: 'First Figma build',
    route: '/v1',
    notes:
      'Three-column header, large "founding designer @anuma.ai" headline with the previously block bottom-aligned beside it, three thumbnails in a row. Fixed px sizing.',
  },
  {
    step: '02',
    title: 'Rem-based version',
    route: '/rem',
    notes:
      'Same structure as the Figma build, but every size scales from a 1440px frame so the first viewport looks the same at any width. Added the San Francisco day/night icon.',
  },
  {
    step: '03',
    title: 'Curved 3D gallery',
    route: '/two',
    notes:
      'Centered headline, infinite WebGL strip that bends into the viewport edges (system.studio inspired), and the miniplayer-style tick index with Coinbase / Base / NFT Labs / Anuma.',
  },
  {
    step: '04a',
    title: 'Bruno fold — first pass',
    route: '/fold/medium',
    notes:
      'Single fold with left thumbnail rail and large preview. Medium-weight two-line headline, the version before we lightened it.',
  },
  {
    step: '04b',
    title: 'Bruno fold — regular, two lines',
    route: '/fold/two-line',
    notes:
      'Same fold with the headline in Regular weight and slightly looser leading.',
  },
  {
    step: '04c',
    title: 'Bruno fold — current',
    route: '/',
    notes:
      'Regular weight on one line. This is what the homepage shows right now.',
  },
  {
    step: '05',
    title: 'Sasha heading + Bruno rail',
    route: '/fold/sasha',
    notes:
      'Paragraph headline with a mono "based in" label (sashabirukoff.com), over the same scrolling rail and preview. The preview gets a project row with count, one-line description, and tags.',
  },
  {
    step: '06',
    title: 'Figma scaffold, exact',
    route: '/fold/figma',
    notes:
      'The original Figma frame rebuilt to its measurements: 1440px max width, 48px headline, 20px header and "previously" text, 48px rounded thumbnails, and a 10px-radius preview. Keeps the Bruno scroll on the rail.',
  },
  {
    step: '07',
    title: 'New Phase type poster',
    route: '/fold/phase',
    notes:
      'Inspired by the New Phase specimen: striped serif headline in four staggered, overlapping lines, bold uppercase grotesk labels, a justified credit line, and grain on warm paper. Same rail and preview.',
  },
  {
    step: '08',
    title: 'Grid, simplified fold',
    route: '/grid/simple',
    notes:
      'Single screen on the 12-column grid: "Atharva." on the left, the headline on the right half, and two half-width thumbnails along the bottom. Neue Haas Grotesk Display Medium, with links and a sun icon in the header.',
  },
] as const;

const LOST = [
  'Two projects per row, with the headline sized to match the text block beside it',
  'Satoshi headline font (before switching everything to Open Runde)',
  'Repeated thumbnail rows with staggered / broken alignment',
  'Bento-style thumbnail grid from your SVG box values',
  'Upward-scrolling curved gallery with rubber banding, before it became the centered /two layout',
];

export default function ComparePage() {
  return (
    <main className="min-h-dvh bg-[#FCFCFC] px-[24px] py-[32px] font-runde text-[#202020] antialiased">
      <header className="mx-auto max-w-[1600px]">
        <p className="text-[13px] leading-[18px] text-[#8A8A8A]">Portfolio session walkthrough</p>
        <h1 className="mt-[4px] text-[24px] font-medium leading-[30px] tracking-[-0.02em]">
          Layouts so far
        </h1>
        <p className="mt-[8px] max-w-[640px] text-[14px] leading-[20px] text-[#5C5C5C]">
          Each preview is the live page rendered at 1440×900. You can scroll and hover inside
          them, or open one full size.
        </p>
      </header>

      <section className="mx-auto mt-[32px] grid max-w-[1600px] grid-cols-1 gap-x-[24px] gap-y-[40px] lg:grid-cols-2">
        {LIVE.map((item) => (
          <article key={item.route}>
            <LayoutPreview src={item.route} title={item.title} />
            <div className="mt-[12px] flex items-baseline justify-between gap-[16px]">
              <h2 className="text-[15px] font-medium leading-[20px] tracking-[-0.01em]">
                <span className="mr-[8px] text-[#8A8A8A]">{item.step}</span>
                {item.title}
              </h2>
              <a
                href={item.route}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-[13px] leading-[18px] text-[#5C5C5C] underline underline-offset-2 hover:text-[#202020]"
              >
                Open {item.route}
              </a>
            </div>
            <p className="mt-[4px] max-w-[560px] text-[13px] leading-[19px] text-[#5C5C5C]">
              {item.notes}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-[56px] max-w-[1600px] border-t border-[#E8E8E8] pt-[24px]">
        <h2 className="text-[15px] font-medium leading-[20px]">Explored, but not preserved</h2>
        <p className="mt-[4px] max-w-[640px] text-[13px] leading-[19px] text-[#5C5C5C]">
          These were edited in place and later replaced, and the project has no git history, so
          they can&rsquo;t be shown live. Any of them can be rebuilt as a route if you want to
          compare it.
        </p>
        <ul className="mt-[12px] space-y-[6px] text-[13px] leading-[19px] text-[#202020]">
          {LOST.map((item) => (
            <li key={item} className="flex gap-[8px]">
              <span className="text-[#8A8A8A]">–</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
