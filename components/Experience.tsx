'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  bullets: string[];
}

const experiences: Experience[] = [
  {
    company: 'Coinbase',
    role: 'Product Design Intern',
    bullets: [
      'Redesigned onchain verification experiences for end-users, leveraging insights from usability testing.',
      'Designed a product page for onchain verifications on the Coinbase Developer platform.',
      'Conducted user testing for the Coinbase verification product page, establishing a vision and opportunities for further iteration.',
    ],
  },
  {
    company: 'NFT Labs',
    role: 'Product Designer',
    bullets: [
      'Designed 0-1 web3 ventures with focus on user experience and conversion.',
      'Enabled NFT claiming success rate of 98% through thoughtful design.',
    ],
  },
  {
    company: 'Pineapple Design',
    role: 'Product Designer',
    bullets: [
      'Worked on various product design projects.',
    ],
  },
  {
    company: 'Indiana University',
    role: 'Graphic Designer',
    bullets: [
      'Created visual designs for university projects and initiatives.',
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-medium text-gray-900 mb-12"
        >
          I&apos;ve been designing for a while...
        </motion.h2>
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {exp.company}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {exp.role}
                  </p>
                </div>
                {expanded === index ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              {expanded === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4"
                >
                  <ul className="space-y-2 mt-2">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-gray-600 text-sm leading-relaxed"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
