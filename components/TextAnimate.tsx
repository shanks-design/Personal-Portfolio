'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export type LineSegment =
  | { type: 'text'; value: string; className?: string }
  | {
      type: 'image';
      src: string;
      alt: string;
      width: number;
      height: number;
      className?: string;
      style?: React.CSSProperties;
      imageStyle?: React.CSSProperties;
    };

type TextAnimateByLineProps = {
  lines: LineSegment[][];
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  as?: 'p' | 'div' | 'span';
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export function TextAnimateByLine({
  lines,
  delay = 0,
  duration = 0.5,
  stagger = 0.12,
  className = '',
  as: Component = 'div',
}: TextAnimateByLineProps) {
  return (
    <Component className={className}>
      {lines.map((lineSegments, lineIndex) => (
        <motion.span
          key={lineIndex}
          className="inline"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{
            duration,
            delay: delay + lineIndex * stagger,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {lineSegments.map((seg, i) => {
            if (seg.type === 'text') {
              return (
                <span key={i} className={seg.className}>
                  {seg.value}
                </span>
              );
            }
            return (
              <span
                key={i}
                className={`inline-block align-middle ${seg.className ?? ''}`}
                style={seg.style}
              >
                <Image
                  src={seg.src}
                  alt={seg.alt}
                  width={seg.width}
                  height={seg.height}
                  className="inline-block align-middle"
                  style={{ verticalAlign: 'middle', ...seg.imageStyle }}
                />
              </span>
            );
          })}
        </motion.span>
      ))}
    </Component>
  );
}
