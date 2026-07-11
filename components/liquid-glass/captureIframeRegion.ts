/**
 * Capture a cropped view of a same-origin iframe region for liquid-glass refraction.
 * Draws a black backdrop + intersecting .card images into a canvas and returns a blob: URL.
 */

export interface IframeRegion {
  /** Left edge relative to the iframe's viewport (contentDocument coords). */
  left: number;
  /** Top edge relative to the iframe's viewport. */
  top: number;
  width: number;
  height: number;
}

const VOID = '#000000';

/**
 * Rasterize the iframe content under `region` into a blob: URL.
 * Caller is responsible for revoking previous URLs.
 */
export async function captureIframeRegion(
  iframe: HTMLIFrameElement,
  region: IframeRegion,
): Promise<string | null> {
  const doc = iframe.contentDocument;
  if (!doc || !doc.body) return null;

  const { left, top, width, height } = region;
  if (width < 1 || height < 1) return null;

  const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, width, height);

  const cards = doc.querySelectorAll<HTMLElement>('.card');
  const right = left + width;
  const bottom = top + height;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (card.style.display === 'none') continue;

    const rect = card.getBoundingClientRect();
    if (rect.right < left || rect.left > right || rect.bottom < top || rect.top > bottom) {
      continue;
    }

    const img = card.querySelector('img');
    const radius = 16 * (rect.width / 240);
    const dx = rect.left - left;
    const dy = rect.top - top;

    ctx.save();
    roundRect(ctx, dx, dy, rect.width, rect.height, Math.max(4, radius));
    ctx.clip();

    ctx.fillStyle = '#13131c';
    ctx.fillRect(dx, dy, rect.width, rect.height);

    if (img && img.complete && img.naturalWidth > 0) {
      try {
        ctx.drawImage(img, dx, dy, rect.width, rect.height);
      } catch {
        // Cross-origin or decode failure — keep plate
      }
    }

    ctx.restore();
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
  if (!blob) return null;

  return URL.createObjectURL(blob);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
