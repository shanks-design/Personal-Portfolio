import SfLocation from '@/components/SfLocation';
import { PROJECTS } from '@/lib/projects';

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-white text-black font-runde font-normal antialiased selection:bg-black selection:text-white">
      <div className="flex min-h-dvh flex-col p-6">
        <header className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          <p className="meta-text text-left">
            atharva
            <br />
            sakharkar
          </p>
          <SfLocation className="meta-text text-left" />
          <p className="meta-text text-left sm:text-right">
            <a
              href="#resume"
              className="transition-opacity hover:opacity-50"
            >
              resume
            </a>
            <br />
            <a
              href="mailto:hello@atharva.cc"
              className="transition-opacity hover:opacity-50"
            >
              atharva@design
            </a>
          </p>
        </header>

        <section className="mt-[152px] grid grid-cols-1 items-end gap-8 sm:grid-cols-3 sm:gap-8">
          <p className="meta-text text-left">
            previously @
            <br />
            coinbase, nft labs,
            <br />
            pineapple design,
            <br />
            Indiana University
          </p>
          <h1
            className="font-runde font-medium text-left text-black sm:col-span-2 text-[48px] leading-[48px] tracking-[-0.02em] lg:text-[88px] lg:leading-[88px]"
            style={{ fontWeight: 500 }}
          >
            founding designer
            <br />
            <a
              href="https://anuma.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-50"
            >
              @anuma.ai
            </a>
          </h1>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
          {PROJECTS.map((project, index) => (
            <a
              key={`${project.title}-${index}`}
              href={project.href}
              className="group block"
            >
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: '896 / 728' }}
              >
                <div
                  role="img"
                  aria-label={project.title}
                  className="h-full w-full bg-[#E8E8E8] transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              <p className="mt-3 text-[16px] leading-[20px] tracking-[-0.02em]">
                {project.title}
              </p>
              <p className="mt-0.5 text-[14px] leading-[20px] tracking-[-0.02em] text-[#808080]">
                {project.meta}
              </p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
