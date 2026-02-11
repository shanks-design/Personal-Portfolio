'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link2, FileText, Users } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  bullets: string[];
  logoBg: string;
  logoLetter: string;
}

const experiences: Experience[] = [
  {
    company: 'Coinbase',
    role: 'Product Design Intern',
    logoBg: '#0052FF',
    logoLetter: 'C',
    bullets: [
      'Redesigned onchain verification experiences for end-users, leveraging insights from usability testing.',
      'Designed a product page for onchain verifications on the Coinbase Developer platform.',
      'Conducted user testing for the Coinbase verification product page, establishing a vision and opportunities for further iteration.',
    ],
  },
  {
    company: 'Pineapple Design',
    role: 'Product Designer',
    logoBg: '#22c55e',
    logoLetter: 'P',
    bullets: [
      'Worked on various product design projects.',
    ],
  },
  {
    company: 'Indiana University',
    role: 'Graphic Designer',
    logoBg: '#b91c1c',
    logoLetter: 'Ψ',
    bullets: [
      'Created visual designs for university projects and initiatives.',
    ],
  },
  {
    company: 'NFT Labs',
    role: 'Product Designer',
    logoBg: '#7c3aed',
    logoLetter: 'N',
    bullets: [
      'Designed 0-1 web3 ventures with focus on user experience and conversion.',
      'Enabled NFT claiming success rate of 98% through thoughtful design.',
    ],
  },
];

const bulletIcons = [Link2, FileText, Users];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggleExpanded = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section
      ref={ref}
      className="relative bg-black rounded-t-[40px] px-4 sm:px-6 lg:px-8 pb-20"
      style={{ paddingTop: 72 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="font-semibold text-white"
            style={{
              fontSize: '33px',
              lineHeight: '64px',
              letterSpacing: '-4%',
            }}
          >
            I&apos;ve been designing for a while...
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div
                  className="shrink-0 flex items-center justify-center text-white font-semibold text-lg"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: exp.logoBg,
                  }}
                >
                  {exp.logoLetter}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-white font-bold"
                    style={{
                      fontSize: '17px',
                      lineHeight: '25px',
                      letterSpacing: '-1%',
                    }}
                  >
                    {exp.company}
                  </h3>
                  <p
                    className="text-[#808080] font-normal"
                    style={{
                      fontSize: '17px',
                      lineHeight: '25px',
                      letterSpacing: '-1%',
                      marginTop: 0,
                    }}
                  >
                    {exp.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpanded(index)}
                  className="shrink-0 text-white font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: '#333333',
                    borderRadius: '32px',
                    border: '1px solid #434343',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 12,
                    paddingRight: 12,
                    fontSize: '14px',
                    lineHeight: '24px',
                  }}
                >
                  {expanded.has(index) ? 'Hide -' : 'View Impact +'}
                </button>
              </div>
              <AnimatePresence>
                {expanded.has(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <ul className="experience-bullets px-5 pb-5 pt-0 space-y-3">
                      {exp.bullets.map((bullet, i) => {
                        const Icon = bulletIcons[i % bulletIcons.length];
                        return (
                          <li
                            key={i}
                            className="experience-bullet flex gap-3 pt-3 first:pt-4"
                            style={{
                              fontSize: '16px',
                              lineHeight: '28px',
                              color: '#808080',
                            }}
                          >
                            <Icon
                              size={28}
                              className="shrink-0 mt-0.5"
                              style={{ color: '#B2B2B2' }}
                              strokeWidth={1.5}
                            />
                            <span>{bullet}</span>
                          </li>
                        );
                      })}
                    </ul>
                    <style>{`.experience-bullet strong { color: #B2B2B2; }`}</style>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
