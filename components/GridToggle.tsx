'use client';

import type { ReactNode } from 'react';
import { toggleGridOverlay } from './GridOverlay';

export default function GridToggle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={toggleGridOverlay} className={`cursor-default text-left ${className ?? ''}`}>
      {children}
    </button>
  );
}
