'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type HTMLMotionProps,
} from 'framer-motion';

import { cn } from '@/lib/utils';

/**
 * A custom pointer component that displays an animated cursor.
 * Add this as a child to any component to enable a custom pointer when hovering.
 * You can pass custom children to render as the pointer.
 */
export function Pointer({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<'div'>): React.ReactNode {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parentElement =
      typeof window !== 'undefined'
        ? (containerRef.current?.parentElement ?? null)
        : null;

    if (!parentElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    parentElement.style.cursor = 'none';
    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', handleMouseEnter);
    parentElement.addEventListener('mouseleave', handleMouseLeave);

    // Same-origin iframes steal mouse events — forward them so the cursor
    // keeps tracking while interacting with embedded canvas content.
    const iframeCleanups: Array<() => void> = [];

    const attachIframe = (iframe: HTMLIFrameElement) => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const styleEl = doc.createElement('style');
      styleEl.setAttribute('data-custom-pointer', 'true');
      styleEl.textContent = '*, *::before, *::after { cursor: none !important; }';
      doc.head.appendChild(styleEl);

      const forwardMove = (e: MouseEvent) => {
        const rect = iframe.getBoundingClientRect();
        x.set(e.clientX + rect.left);
        y.set(e.clientY + rect.top);
        setIsActive(true);
      };

      const forwardLeave = (e: MouseEvent) => {
        const rect = parentElement.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();
        const absX = e.clientX + iframeRect.left;
        const absY = e.clientY + iframeRect.top;
        if (
          absX < rect.left ||
          absX > rect.right ||
          absY < rect.top ||
          absY > rect.bottom
        ) {
          setIsActive(false);
        }
      };

      doc.addEventListener('mousemove', forwardMove);
      doc.addEventListener('mouseenter', forwardMove);
      doc.addEventListener('mouseleave', forwardLeave);

      iframeCleanups.push(() => {
        styleEl.remove();
        doc.removeEventListener('mousemove', forwardMove);
        doc.removeEventListener('mouseenter', forwardMove);
        doc.removeEventListener('mouseleave', forwardLeave);
      });
    };

    const iframes = parentElement.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const el = iframe as HTMLIFrameElement;
      if (el.contentDocument?.readyState === 'complete') {
        try {
          attachIframe(el);
        } catch {
          // Ignore cross-origin or inaccessible frames
        }
      }
      const onLoad = () => {
        try {
          attachIframe(el);
        } catch {
          // Ignore cross-origin or inaccessible frames
        }
      };
      el.addEventListener('load', onLoad);
      iframeCleanups.push(() => el.removeEventListener('load', onLoad));
    });

    return () => {
      parentElement.style.cursor = '';
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', handleMouseEnter);
      parentElement.removeEventListener('mouseleave', handleMouseLeave);
      iframeCleanups.forEach((cleanup) => cleanup());
    };
  }, [x, y]);

  return (
    <>
      <div ref={containerRef} />
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="pointer-events-none fixed z-[1100] -translate-x-1/2 -translate-y-1/2"
            style={{
              top: y,
              left: x,
              ...style,
            }}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            {...props}
          >
            {children || (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  'rotate-[-70deg] stroke-white text-black',
                  className,
                )}
              >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
