'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME_W = 1440;
const FRAME_H = 900;

export default function LayoutPreview({ src, title }: { src: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => setScale(box.clientWidth / FRAME_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden border border-[#E8E8E8] bg-white"
      style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
    >
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
