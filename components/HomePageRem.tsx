import SfLocation from '@/components/SfLocation';
import { PROJECTS } from '@/lib/projects';

export default function HomePageRem() {
  return (
    <main className="rem-page min-h-dvh bg-white text-black antialiased selection:bg-black selection:text-white">
      <div className="flex min-h-dvh flex-col p-[1.5rem]">
        <header className="grid shrink-0 grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-0">
          <p className="meta-text-rem text-left">
            atharva
            <br />
            sakharkar
          </p>
          <SfLocation className="meta-text-rem text-left" iconSize="1.25rem" />
          <p className="meta-text-rem text-left lg:text-right">
            <a href="#resume" className="transition-opacity hover:opacity-50">
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

        <section className="mt-12 grid shrink-0 grid-cols-1 items-end gap-8 lg:mt-[9.5rem] lg:grid-cols-3 lg:gap-0">
          <p className="meta-text-rem text-left">
            previously @
            <br />
            coinbase, nft labs,
            <br />
            pineapple design,
            <br />
            Indiana University
          </p>
          <h1
            className="text-left font-runde text-[5.5rem] leading-[5.5rem] tracking-[-0.02em] text-black lg:col-span-2"
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

        <section className="mt-12 grid grid-cols-1 gap-8 lg:mt-[3rem] lg:grid-cols-3 lg:gap-[1rem]">
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
              <p className="mt-[0.75rem] font-runde text-[1rem] font-medium leading-[1.25rem] tracking-normal text-black">
                {project.title}
              </p>
              <p className="mt-[0.125rem] font-runde text-[0.875rem] font-medium leading-[1.25rem] tracking-normal text-[#808080]">
                {project.meta}
              </p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
