'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const MUSIC_TRACKS = [
  { src: '/lofi-chill.mp3', label: 'Lofi Chill Music' },
  { src: '/smooth-jazz-2025.mp3', label: 'Smooth Jazz 2025' },
  { src: '/upbeat-smooth-jazz.mp3', label: 'Upbeat Smooth Jazz' },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const musicAudioRef = useRef<HTMLAudioElement>(null);

  const toggleMusicPlay = useCallback(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setMusicPlaying((p) => !p);
  }, [musicPlaying]);

  const goToPrevTrack = useCallback(() => {
    setCurrentTrackIndex((i) => (i - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
  }, []);

  const goToNextTrack = useCallback(() => {
    setCurrentTrackIndex((i) => (i + 1) % MUSIC_TRACKS.length);
  }, []);

  // When track index changes, load new src and play if we're in playing state (e.g. after prev/next or onEnded)
  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    audio.src = MUSIC_TRACKS[currentTrackIndex].src;
    audio.load();
    if (musicPlaying) {
      const playWhenReady = () => {
        audio.play().catch(() => {});
        audio.removeEventListener('canplay', playWhenReady);
      };
      audio.addEventListener('canplay', playWhenReady);
      return () => audio.removeEventListener('canplay', playWhenReady);
    }
  }, [currentTrackIndex]); // eslint-disable-line react-hooks/exhaustive-deps -- only run when track changes; musicPlaying used inside

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
      className="relative bg-black rounded-[40px]"
      style={{ paddingTop: 72, paddingBottom: 120 }}
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
              letterSpacing: '-0.02em',
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

        <div className="mt-24" style={{ marginBottom: 32 }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="font-semibold text-white"
            style={{
              fontSize: '33px',
              lineHeight: '64px',
              letterSpacing: '-0.02em',
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
              className="shrink-0 bg-[#171717] hover:bg-[#1a1a1a] transition-colors cursor-default overflow-hidden"
              style={{
                width: '488px',
                height: '515px',
                borderRadius: 16,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset -1px -1px 4px 0 rgba(255, 255, 255, 0.06)',
              }}
            >
              {i === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-0" style={{ boxSizing: 'border-box' }}>
                  <audio
                    ref={musicAudioRef}
                    src={MUSIC_TRACKS[currentTrackIndex].src}
                    onEnded={() => setCurrentTrackIndex((i) => (i + 1) % MUSIC_TRACKS.length)}
                    onPause={() => setMusicPlaying(false)}
                    onPlay={() => setMusicPlaying(true)}
                  />
                  {/* Music player: body + pin + disc — sized to leave room for text + icon bar */}
                  <div className="relative flex-none" style={{ width: 350, height: 350 }}>
                    <Image
                      src="/music-player-body.png"
                      alt=""
                      width={350}
                      height={350}
                      className="shrink-0 object-cover"
                    />
                    {/* Pin on the right side (top-right pivot area, per reference); 110×270px; offset 28px down, 28px left; on top of disc */}
                    <div
                      className="absolute z-20 flex items-center justify-end origin-top-right"
                      style={{ top: 26, right: 26, width: 104, height: 255 }}
                    >
                      <Image
                        src="/music-player-pin.png"
                        alt=""
                        width={104}
                        height={255}
                        className="object-contain object-top object-right"
                      />
                    </div>
                    {/* Disc (vinyl) — spins when musicPlaying */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <div
                        className="rounded-full shrink-0"
                        style={{
                          width: 265,
                          height: 265,
                          animation: musicPlaying ? 'vinyl-spin 4.96s linear infinite' : 'none',
                        }}
                      >
                        <Image
                          src="/music-player-disc.png"
                          alt=""
                          width={265}
                          height={265}
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Spacing between player and text+icon bar */}
                  <div style={{ height: 24 }} />
                  {/* Text + icon bar: Vibe.zip, 20px gap, then icon bar */}
                  <div className="flex flex-col items-center w-full flex-none">
                    <div className="flex items-center justify-center shrink-0 w-full" style={{ height: 20, marginBottom: 16 }}>
                      <p
                        className="text-center font-normal block m-0"
                        style={{ fontSize: 20, lineHeight: 20, color: '#9C9C9C' }}
                      >
                        {MUSIC_TRACKS[currentTrackIndex].label}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-center w-full px-4 shrink-0">
                      <div
                        className="flex items-center justify-center"
                        style={{ width: 112, height: 28, gap: 12 }}
                      >
                      <button
                        type="button"
                        onClick={goToPrevTrack}
                        className="p-0 flex items-center justify-center shrink-0 cursor-pointer"
                        style={{ width: 28, height: 28, color: '#404040' }}
                        aria-label="Previous track"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                          <g clipPath="url(#clip0_prev)">
                            <path d="M5.25 3.75V20.25" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.75 4.48878V19.5113C18.7473 19.6434 18.7097 19.7724 18.6411 19.8853C18.5725 19.9982 18.4753 20.091 18.3593 20.1543C18.2433 20.2176 18.1127 20.2491 17.9806 20.2457C17.8485 20.2422 17.7197 20.2039 17.6072 20.1347L5.59687 12.6235C5.49088 12.5576 5.40343 12.4658 5.34279 12.3567C5.28216 12.2476 5.25033 12.1248 5.25033 12C5.25033 11.8752 5.28216 11.7525 5.34279 11.6434C5.40343 11.5343 5.49088 11.4425 5.59687 11.3766L17.6072 3.86534C17.7197 3.79612 17.8485 3.75785 17.9806 3.7544C18.1127 3.75096 18.2433 3.78248 18.3593 3.84575C18.4753 3.90902 18.5725 4.00181 18.6411 4.11473C18.7097 4.22765 18.7473 4.35669 18.75 4.48878Z" fill="#404040"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_prev">
                              <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={toggleMusicPlay}
                        className="p-0 flex items-center justify-center shrink-0 cursor-pointer"
                        style={{ width: 28, height: 28 }}
                        aria-label={musicPlaying ? 'Pause' : 'Play'}
                      >
                        {musicPlaying ? (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                            <rect x="6" y="4" width="4" height="16" rx="1" fill="#FFFFFF"/>
                            <rect x="14" y="4" width="4" height="16" rx="1" fill="#FFFFFF"/>
                          </svg>
                        ) : (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                            <g clipPath="url(#clip0_play)">
                              <path d="M6.75 3.73876V20.2613C6.75245 20.3931 6.78962 20.522 6.85776 20.6349C6.9259 20.7478 7.0226 20.8407 7.13812 20.9043C7.25364 20.9679 7.38388 20.9999 7.51572 20.9972C7.64756 20.9944 7.77634 20.9569 7.88906 20.8884L21.3966 12.6272C21.5045 12.5619 21.5937 12.4699 21.6556 12.36C21.7175 12.2501 21.7501 12.1261 21.7501 12C21.7501 11.8739 21.7175 11.7499 21.6556 11.64C21.5937 11.5302 21.5045 11.4381 21.3966 11.3728L7.88906 3.11157C7.77634 3.04314 7.64756 3.00564 7.51572 3.00285C7.38388 3.00007 7.25364 3.03209 7.13812 3.0957C7.0226 3.1593 6.9259 3.25224 6.85776 3.36514C6.78962 3.47804 6.75245 3.60691 6.75 3.73876Z" fill="#FFFFFF"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_play">
                                <rect width="24" height="24" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={goToNextTrack}
                        className="p-0 flex items-center justify-center shrink-0 cursor-pointer"
                        style={{ width: 28, height: 28 }}
                        aria-label="Next track"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                          <g clipPath="url(#clip0_next)">
                            <path d="M18.75 3.75V20.25" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.25 4.48878V19.5113C5.25271 19.6434 5.29026 19.7724 5.35886 19.8853C5.42747 19.9982 5.52468 20.091 5.64067 20.1543C5.75665 20.2176 5.8873 20.2491 6.01937 20.2457C6.15145 20.2422 6.28028 20.2039 6.39281 20.1347L18.4031 12.6235C18.5091 12.5576 18.5966 12.4658 18.6572 12.3567C18.7178 12.2476 18.7497 12.1248 18.7497 12C18.7497 11.8752 18.7178 11.7525 18.6572 11.6434C18.5966 11.5343 18.5091 11.4425 18.4031 11.3766L6.39281 3.86534C6.28028 3.79612 6.15145 3.75785 6.01937 3.7544C5.8873 3.75096 5.75665 3.78248 5.64067 3.84575C5.52468 3.90902 5.42747 4.00181 5.35886 4.11473C5.29026 4.22765 5.25271 4.35669 5.25 4.48878Z" fill="#404040"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_next">
                              <rect width="24" height="24" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
