import GridSimpleFold from '@/components/GridSimpleFold';
import { type GridCardData } from '@/components/GridCard';

const CARDS: readonly GridCardData[] = [
  {
    title: 'Base App',
    company: 'Coinbase',
    placement: 'col-span-6 col-start-1',
    video: '/projects/base-app.mp4',
    videoWebm: '/projects/base-app.webm',
    poster: '/projects/base-app.webp?v=3',
  },
  {
    title: 'Anuma',
    company: 'Anuma AI',
    placement: 'col-span-6 col-start-7',
    video: '/projects/anuma.mp4',
    videoWebm: '/projects/anuma.webm',
    poster: '/projects/anuma.webp?v=2',
  },
];

export default function GridSimpleIcePage() {
  return <GridSimpleFold cards={CARDS} />;
}
