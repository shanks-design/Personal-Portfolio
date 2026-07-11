'use client';

import Image from 'next/image';
import { TextAnimateByLine, type LineSegment } from '@/components/TextAnimate';

const WALLET_LOGOS: { src: string; alt: string; href?: string }[] = [
  { src: '/wallet-email-logo.png', alt: 'Email', href: 'mailto:atharva.sakharkar33@gmail.com' },
  { src: '/wallet-twitter-logo.png', alt: 'Twitter', href: 'https://x.com/OGAtharva' },
  { src: '/wallet-linkedin-logo.png', alt: 'LinkedIn', href: 'https://www.linkedin.com/in/atharva33/' },
  { src: '/wallet-youtube-logo.png', alt: 'YouTube' },
];

const HERO_LINES: LineSegment[][] = [
  [
    { type: 'text', value: "i'm a product designer" },
    { type: 'text', value: ' based in ' },
    { type: 'text', value: 'san francisco', className: 'font-semibold' },
    {
      type: 'image',
      src: '/sf-icon.svg',
      alt: 'San Francisco',
      width: 48,
      height: 48,
      className: 'ml-3',
      style: { transform: 'translateY(-4px)' },
    },
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
    {
      type: 'image',
      src: '/cb-logo.png',
      alt: 'Coinbase',
      width: 48,
      height: 48,
      style: { paddingLeft: '5px', paddingRight: '0px', paddingBottom: '5px', transform: 'translateY(-4px)' },
      imageStyle: { borderRadius: 4 },
    },
    { type: 'text', value: ' ' },
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
        <div
          className="relative mt-[-8px] wallet-container cursor-pointer"
          style={{ width: '357px', height: '209px' }}
        >
          <div className="absolute inset-0">
            <div className="wallet-logos absolute top-0 left-0 right-0 flex items-center justify-center gap-3">
              {WALLET_LOGOS.map((logo, index) => {
                const image = (
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={72}
                    height={72}
                    className={`rounded-2xl object-contain transition-all duration-500 ease-out ${
                      index === WALLET_LOGOS.length - 1 ? 'border border-black/[0.06]' : ''
                    }`}
                  />
                );
                const wrapperClassName = 'inline-block transition-transform duration-500 ease-out hover:scale-[1.03]';
                const wrapperStyle = {
                  transform: `rotate(${index % 2 === 0 ? -4 : 4}deg)`,
                };

                if (logo.href) {
                  const isExternal = logo.href.startsWith('http');

                  return (
                    <a
                      key={logo.src}
                      href={logo.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      aria-label={logo.alt}
                      className={wrapperClassName}
                      style={wrapperStyle}
                    >
                      {image}
                    </a>
                  );
                }

                return (
                  <span key={logo.src} className={wrapperClassName} style={wrapperStyle}>
                    {image}
                  </span>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <Image
                src="/new-wallet.png"
                alt="Wallet"
                width={357}
                height={64}
                sizes="357px"
                quality={92}
                className="inline-block"
                style={{ width: '357px', height: 'auto' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
