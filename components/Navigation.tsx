'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-[22px]',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-[1080px] mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-[28px] font-semibold text-gray-900 hover:text-gray-700 transition-colors tracking-[-0.02em]"
            >
              Atharva.
            </Link>
          </div>

          <div className="flex items-center">
            <a
              href="#resume"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-[22px] font-medium tracking-[-0.03em]"
              style={{ height: '24px' }}
            >
              <span>📄</span>
              <span>Resume</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
