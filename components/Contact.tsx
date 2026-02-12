'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const links = [
    { label: 'Linkedin', href: 'https://linkedin.com/in/atharva' },
    { label: 'Twitter', href: 'https://twitter.com/atharva' },
    { label: 'Contact', href: 'mailto:hello@atharva.cc' },
    { label: 'Resume', href: '#resume' },
  ];

  return (
    <footer
      id="contact"
      ref={ref}
      className="font-inter bg-white rounded-t-[40px] px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: 64, paddingBottom: 80 }}
    >
      <div className="max-w-[1080px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          >
          <div style={{ marginBottom: 48 }}>
            <h2
              className="font-semibold text-gray-900"
              style={{
                fontSize: '40px',
                lineHeight: '48px',
                letterSpacing: '-0.04em',
                marginBottom: 16,
              }}
            >
              Let&apos;s Talk{' '}
            <img
              src="/wave-hand.png"
              alt=""
              width={40}
              height={40}
              className="inline-block align-middle"
              style={{ verticalAlign: 'middle', paddingBottom: 6 }}
            />
            </h2>
            <p
              className="font-normal"
              style={{
                color: '#808080',
                fontSize: '24px',
                lineHeight: '36px',
                letterSpacing: '-0.015em',
              }}
            >
              Connect with me for collaboration, coffee, or fun.
            </p>
          </div>

          <div
            className="border-t"
            style={{ borderColor: '#E0E0E0', paddingTop: 32 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <nav className="flex flex-wrap gap-x-6 gap-y-1">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') || link.href.startsWith('mailto') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="font-normal hover:text-gray-900 transition-colors"
                    style={{
                      fontSize: '20px',
                      lineHeight: '24px',
                      letterSpacing: '-0.01em',
                      color: '#808080',
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <p
                className="font-normal shrink-0"
                style={{
                  fontSize: '20px',
                  lineHeight: '24px',
                  letterSpacing: '-0.01em',
                  color: '#808080',
                }}
              >
                Designed by Atharva in California :)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
