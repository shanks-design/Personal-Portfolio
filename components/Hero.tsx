'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TextAnimateByLine, type LineSegment } from '@/components/TextAnimate';

const HERO_LINES: LineSegment[][] = [
  [
    { type: 'text', value: "Hello! I'm Atharva — a " },
    { type: 'text', value: 'product designer', className: 'font-semibold' },
    { type: 'text', value: ' based in ' },
    { type: 'text', value: 'sf', className: 'font-semibold' },
    {
      type: 'image',
      src: '/sf-icon.svg',
      alt: 'San Francisco',
      width: 48,
      height: 48,
      className: 'ml-3',
      style: { transform: 'translateY(-4px)' },
    },
  ],
  [
    { type: 'text', value: ' interested in ' },
    { type: 'text', value: 'visual design', className: 'font-semibold' },
    { type: 'text', value: ', design systems, web3, and gen ai. Currently, I am working at ' },
    {
      type: 'image',
      src: '/cb-logo.png',
      alt: 'Coinbase',
      width: 48,
      height: 48,
      style: { paddingLeft: '5px', paddingRight: '0px', paddingBottom: '5px', transform: 'translateY(-4px)' },
      imageStyle: { borderRadius: 4 },
    },
  ],
  [
    { type: 'text', value: ' ' },
    { type: 'text', value: 'Coinbase', className: 'font-semibold' },
    { type: 'text', value: ' designing the ' },
    { type: 'text', value: 'base', className: 'font-semibold' },
    { type: 'text', value: ' app to help users create, earn, and trade onchain.' },
  ],
];

export default function Hero() {
  return (
    <section className="flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-[96px] pb-[120px]">
      <div className="max-w-[1080px] mx-auto mt-0">
        <TextAnimateByLine
          lines={HERO_LINES}
          delay={0}
          duration={0.5}
          stagger={0.12}
          className="text-[40px] leading-[64px] tracking-[-0.03em] text-gray-900 font-inter font-normal"
          as="div"
        />
        <div className="mt-12 flex items-center gap-3">
          <motion.span
            className="inline-flex items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src="/wave-emoji.svg"
              alt="Wave"
              width={36}
              height={36}
              className="inline-block"
            />
          </motion.span>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-[36px] font-semibold text-gray-900 hover:text-gray-700 transition-colors font-inter inline-block tracking-[-0.03em]"
            style={{ height: '48px', lineHeight: '48px' }}
          >
            {'Get in touch'.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.36 + (i + 1) * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </a>
        </div>
        <div
          className="relative z-20 mt-8 wallet-container cursor-pointer"
          style={{ width: '357px', height: '209px', position: 'relative' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="wallet-logos absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/comp-logos.png"
                alt="Company Logos"
                width={300}
                height={60}
                className="object-contain transition-all duration-500 ease-out"
              />
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
