'use client';

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
  blockLines?: boolean;
};

export function TextAnimateByLine({
  lines,
  className = '',
  as: Component = 'div',
  blockLines = false,
}: TextAnimateByLineProps) {
  return (
    <Component className={className}>
      {lines.map((lineSegments, lineIndex) => {
        const LineWrapper = blockLines ? 'div' : 'span';

        return (
          <LineWrapper
            key={lineIndex}
            className={blockLines ? 'block w-full' : 'inline'}
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
          </LineWrapper>
        );
      })}
    </Component>
  );
}
