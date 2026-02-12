'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ProjectCard from './ProjectCard';

export default function SelectedWorkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative z-10 w-screen bg-black rounded-[40px] px-4 sm:px-6 lg:px-8"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', marginTop: '-120px' }}
    >
      <div className="max-w-[1080px] mx-auto pt-[120px]" style={{ paddingBottom: '120px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-white font-semibold text-[32px] tracking-[-0.03em]"
          style={{ lineHeight: '48px', marginBottom: '24px' }}
        >
          Selected Work
        </motion.h2>
        <div className="flex flex-col gap-8">
          <ProjectCard
            type="Website"
            title="Boosting adoption of"
            titleHighlight="wallet verifications"
            company="Coinbase"
            readTime="8 min read"
            actionText="Request view access"
            screenshot="/verification-content.png"
            buttonIcon="/lock-icon.svg"
          />
          <ProjectCard
            type="Web App"
            title="Enabling a NFT claiming"
            titleHighlight="success rate of 98%"
            company="NFT labs"
            readTime="6 min read"
            actionText="View Case Study"
            screenshot="/nft-mobile.png"
            icon="/mobile.svg"
            gradientStart="#421757"
            gradientEnd="#010101"
            textColor="#E4D7F9"
            highlightColor="#C386F2"
          />
          <ProjectCard
            type="Website"
            title="Designing a landing page"
            titleHighlight="for a virtual marathon"
            company="Conceptual"
            readTime="10 min read"
            actionText="View Case Study"
            screenshot="/marathon-landing.png"
            gradientStart="#11422F"
            gradientEnd="#010101"
            textColor="#D6F5E1"
            highlightColor="#53D781"
            iconColor="#D6F5E1"
          />
        </div>
      </div>
    </section>
  );
}
