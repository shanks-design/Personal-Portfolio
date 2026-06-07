'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};
const transition = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] };

function LastVisitor() {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/visitor')
      .then((response) => response.json())
      .then((data: { lastVisitor?: string | null }) => {
        if (!cancelled && data.lastVisitor) {
          setLocation(data.lastVisitor);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!location) {
    return null;
  }

  return (
    <span
      className="text-gray-500 text-[22px] font-normal tracking-[-0.24px]"
      style={{ height: '24px', lineHeight: '24px' }}
    >
      last visitor · {location}
    </span>
  );
}

export default function Navigation() {
  return (
    <nav className="relative z-50 px-4 sm:px-6 lg:px-8 pt-[22px]">
      <div className="max-w-[1080px] mx-auto">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex-shrink-0"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...transition, delay: 0 }}
          >
            <Link
              href="/"
              className="text-[32px] font-semibold text-gray-900 hover:text-gray-700 transition-colors tracking-[-0.02em]"
            >
              atharva.
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 sm:gap-6"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...transition, delay: 0.1 }}
          >
            <LastVisitor />
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
