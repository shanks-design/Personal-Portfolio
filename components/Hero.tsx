'use client';

import Image from 'next/image';
import { TextAnimateByLine, type LineSegment } from '@/components/TextAnimate';

const HERO_LINES: LineSegment[][] = [
  [
    { type: 'text', value: "i'm a product designer" },
    { type: 'text', value: ' based in ' },
    { type: 'text', value: 'san francisco', className: 'font-semibold' },
    { type: 'text', value: ' ' },
    { type: 'text', value: 'currently, a ' },
    { type: 'text', value: 'founding designer', className: 'font-semibold' },
    { type: 'text', value: ' at a stealth startup' },
    { type: 'text', value: ', building ' },
    { type: 'text', value: 'privacy', className: 'font-semibold' },
    { type: 'text', value: ' focused ' },
    { type: 'text', value: 'ai tools', className: 'font-semibold' },
    { type: 'text', value: '. ' },
    { type: 'text', value: 'i care about creating experiences that go beyond mere usability, shaped by ' },
    { type: 'text', value: 'quality and craft', className: 'font-semibold' },
    { type: 'text', value: '. ' },
    { type: 'text', value: 'previously, i worked at ' },
    { type: 'text', value: 'coinbase', className: 'font-semibold' },
    { type: 'text', value: ' and a few other places.' },
  ],
];

export default function Hero() {
  return (
    <section className="relative z-0 flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-[100px] pb-[120px]">
      <div className="w-full max-w-[1080px] mx-auto mt-0">
        <TextAnimateByLine
          lines={HERO_LINES}
          blockLines
          className="text-[40px] leading-[64px] tracking-[-0.03em] text-gray-900 font-runde font-normal"
          as="div"
        />
        <div className="hidden mt-10 sm:mt-12 flex items-center gap-3">
          <span className="inline-flex items-center">
            <Image
              src="/wave-emoji.svg"
              alt="Wave"
              width={32}
              height={32}
              className="inline-block"
            />
          </span>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-[28px] sm:text-[32px] font-semibold text-gray-900 hover:text-gray-700 transition-colors font-runde inline-block tracking-[-0.03em]"
            style={{ height: '44px', lineHeight: '44px' }}
          >
            Get in touch
          </a>
        </div>
        {/* Preserve the vertical space the wallet used to occupy */}
        <div className="mt-[-8px]" style={{ height: '209px' }} aria-hidden="true" />
      </div>
    </section>
  );
}
