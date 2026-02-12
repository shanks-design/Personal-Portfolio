'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
interface Experience {
  company: string;
  role: string;
  bullets: string[];
  logoBg: string;
  logoLetter: string;
  logoImage?: string;
}

const experiences: Experience[] = [
  {
    company: 'Coinbase',
    role: 'Product Design Intern',
    logoBg: '#0052FF',
    logoLetter: 'C',
    logoImage: '/coinbase-logo.png',
    bullets: [
      'Redesigned <strong>onchain verification</strong> experiences for end-users, leveraging insights from usability testing.',
      'Designed a <strong>product page</strong> for onchain verifications on the Coinbase Developer platform.',
      'Conducted <strong>user testing</strong> for the verification product page, establishing a vision and opportunities for further iteration.',
    ],
  },
  {
    company: 'Pineapple Design',
    role: 'Product Designer',
    logoBg: '#22c55e',
    logoLetter: 'P',
    logoImage: '/pineapple-design-logo.png',
    bullets: [
      'Was a <strong>design catalyst</strong> within the Lido Learning team, driving product and brand initiatives.',
      'Redesigned the Hostgator\'s <strong>cloud management system</strong> for improved usability and scale.',
      'Designed a <strong>stock management system</strong> for Champerche, an agritech startup.',
    ],
  },
  {
    company: 'Indiana University',
    role: 'Graphic Designer',
    logoBg: '#b91c1c',
    logoLetter: 'Ψ',
    logoImage: '/indiana-university-logo.png',
    bullets: [
      'Designed info materials and stationery for diverse student bodies and campus initiatives.',
      'Created visual identity and <strong>marketing collateral</strong> for university events and programs.',
      'Collaborated with faculty and students on <strong>brand and print design</strong> projects.',
    ],
  },
  {
    company: 'NFT Labs',
    role: 'Founding Product Designer',
    logoBg: '#7c3aed',
    logoLetter: 'N',
    logoImage: '/nft-labs-logo.png',
    bullets: [
      'Crafted the <strong>Itsmyne app</strong> interface from scratch across mobile and web app breakpoints.',
      'Designed <strong>micro-sites</strong> for various pilot projects and NFT drops.',
      'Designed <strong>product MVPs</strong> for Social Swag—India\'s first Bollywood NFT marketplace.',
    ],
  },
];

const bulletIconSources = ['/phone-icon.svg', '/web-icon.svg', '/multiple-icon.svg'];

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
      className="relative bg-black rounded-t-[40px] pb-20"
      style={{ paddingTop: 72 }}
    >
      <div className="max-w-[1080px] mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ columnGap: 48 }}>
          {[0, 1].map((colIndex) => (
            <div key={colIndex} className="flex flex-col" style={{ gap: 48 }}>
              {experiences.filter((_, i) => i % 2 === colIndex).map((exp, pairIndex) => {
                const index = colIndex + pairIndex * 2;
                return (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-xl overflow-hidden"
            >
              <div className="flex items-center" style={{ gap: 16 }}>
                {exp.logoImage ? (
                  <img
                    src={exp.logoImage}
                    alt=""
                    width={48}
                    height={48}
                    className="shrink-0 rounded-xl object-cover"
                  />
                ) : (
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
                )}
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
                  className="shrink-0 flex items-center text-white font-medium transition-colors hover:bg-[#3d3d3d]"
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
                  {expanded.has(index) ? (
                    <>
                      <span>Hide</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden style={{ marginLeft: 6 }}>
                        <path d="M13 8H3" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>View Impact</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden style={{ marginLeft: 6 }}>
                        <path d="M13 8H3" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 3L8 13" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
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
                    <ul className="experience-bullets space-y-[22px]" style={{ paddingTop: 24 }}>
                      {exp.bullets.map((bullet, i) => {
                        const iconSrc = bulletIconSources[i % bulletIconSources.length];
                        return (
                          <li
                            key={i}
                            className="experience-bullet flex items-center"
                            style={{
                              gap: 18,
                              fontSize: '16px',
                              lineHeight: '28px',
                              color: '#808080',
                              letterSpacing: '-2%',
                            }}
                          >
                            <span
                              className="shrink-0 experience-bullet-icon-mask"
                              style={{
                                width: 24,
                                height: 24,
                                backgroundColor: '#B2B2B2',
                                WebkitMaskImage: `url(${iconSrc})`,
                                maskImage: `url(${iconSrc})`,
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                              }}
                            />
                            <span
                              style={{ maxWidth: 472 }}
                              dangerouslySetInnerHTML={{ __html: bullet }}
                            />
                          </li>
                        );
                      })}
                    </ul>
                    <style>{`
                      .experience-bullet strong { color: #B2B2B2; font-weight: 600; }
                    `}</style>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
              );
              })}
            </div>
          ))}
        </div>

        <div className="mt-24 mb-12">
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
            Some fun stuff :)
          </motion.h2>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 48 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-[#333333] shrink-0"
              style={{ width: 488, height: 515 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
