'use client';

import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';

/** Floating DialKit panel — development only. */
export default function DialKitProvider() {
  if (process.env.NODE_ENV !== 'development') return null;
  return <DialRoot />;
}
