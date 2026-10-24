'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'grid-overlay';
const TOGGLE_EVENT = 'grid-overlay:toggle';

const columns =
  'repeating-linear-gradient(90deg, rgba(255, 59, 48, 0.09) 0 var(--col), transparent var(--col) var(--pitch))';
const baseline =
  'repeating-linear-gradient(180deg, transparent 0 calc(var(--u) - 1px), rgba(0, 122, 255, 0.22) calc(var(--u) - 1px) var(--u))';

export function toggleGridOverlay() {
  window.dispatchEvent(new Event(TOGGLE_EVENT));
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export default function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) === '1');

    const toggle = () =>
      setVisible((v) => {
        localStorage.setItem(STORAGE_KEY, v ? '0' : '1');
        return !v;
      });
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code !== 'KeyG' || isTyping(e.target)) return;
      toggle();
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener(TOGGLE_EVENT, toggle);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(TOGGLE_EVENT, toggle);
    };
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div className="absolute inset-0" style={{ backgroundImage: baseline }} />
      <div
        className="container-site h-full"
        style={{
          backgroundImage: columns,
          backgroundOrigin: 'content-box',
          backgroundClip: 'content-box',
        }}
      />
    </div>
  );
}
