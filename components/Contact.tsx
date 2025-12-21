'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Linkedin, Twitter, Mail, FileText } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/atharva', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/atharva', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@atharva.cc', label: 'Contact' },
    { icon: FileText, href: '#resume', label: 'Resume' },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-4">
              Let's Talk
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect with me for collaboration, coffee, or fun.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') || social.href.startsWith('mailto') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Icon size={20} />
                  <span>{social.label}</span>
                </a>
              );
            })}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-12">
            Designed by Atharva in California :)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
