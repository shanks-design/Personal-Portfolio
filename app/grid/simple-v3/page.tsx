import GridSimpleFold from '@/components/GridSimpleFold';
import { type GridCardData } from '@/components/GridCard';

const CARDS: readonly GridCardData[] = [
  {
    title: 'Base App',
    company: 'Coinbase',
    placement: 'col-span-6 col-start-1',
    video: '/projects/base-app-blue.mp4',
    videoWebm: '/projects/base-app-blue.webm',
    poster: '/projects/base-app-blue.webp',
  },
  {
    title: 'Anuma',
    company: 'Anuma AI',
    placement: 'col-span-6 col-start-7',
    video: '/projects/anuma-v3.mp4',
    poster: '/projects/anuma-v3.webp',
  },
];

export default function GridSimpleV3Page() {
  return <GridSimpleFold cards={CARDS} />;
}
