'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-[184px] pb-0">
      <div className="max-w-[1080px] mx-auto mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[40px] leading-[64px] tracking-[-0.03em] text-gray-900 dark:text-white font-inter font-normal"
        >
          <span>Hello! I'm Atharva — a </span>
          <span className="font-semibold">product designer</span>
          <span> based in </span>
          <span className="font-semibold">sf</span>
          <Image 
            src="/sf-icon.svg" 
            alt="San Francisco" 
            width={48} 
            height={48} 
            className="inline-block align-middle ml-3"
            style={{ verticalAlign: 'middle', transform: 'translateY(-4px)' }}
          />
          <span> interested in </span>
          <span className="font-semibold">visual design</span>
          <span>, design systems, web3, and gen ai. Currently, I am working at </span>
          <span style={{ paddingLeft: '2px', paddingRight: '8px', display: 'inline-block' }}>
            <Image 
              src="/cb-logo.svg" 
              alt="Coinbase" 
              width={48} 
              height={48} 
              className="inline-block align-middle"
              style={{ verticalAlign: 'middle', transform: 'translateY(-4px)' }}
            />
          </span>
          <span className="font-semibold">Coinbase</span>
          <span> designing the </span>
          <span className="font-semibold">base</span>
          <span> app to help users create, earn, and trade onchain.</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex items-center gap-3"
        >
          <Image 
            src="/wave-emoji.svg" 
            alt="Wave" 
            width={36} 
            height={36} 
            className="inline-block"
          />
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-[36px] font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-inter inline-block tracking-[-0.03em]"
            style={{ height: '48px', lineHeight: '48px' }}
          >
            Get in touch
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 wallet-container cursor-pointer"
          style={{ width: '357px', height: '209px', position: 'relative' }}
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
              src="/wallet.png" 
              alt="Wallet" 
              width={357} 
              height={64} 
              className="inline-block"
              style={{ width: '357px', height: 'auto' }}
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
