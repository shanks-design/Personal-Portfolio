'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="relative z-50 px-4 sm:px-6 lg:px-8 pt-[22px]">
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
