import GridCardVideo from '@/components/GridCardVideo';

export type GridCardData = {
  title: string;
  company: string;
  placement: string;
  video?: string;
  videoWebm?: string;
  poster?: string;
  startOffset?: number;
};

type GridCardProps = GridCardData & {
  height?: string;
  caption?: 'split' | 'inline';
};

export default function GridCard({
  title,
  company,
  placement,
  video,
  videoWebm,
  poster,
  startOffset,
  height = 'h-u19',
  caption = 'split',
}: GridCardProps) {
  return (
    <article className={placement}>
      <div className={`${video && poster ? 'aspect-video' : height} overflow-hidden bg-[#E2E2E2]`}>
        {video && poster ? (
          <GridCardVideo
            src={video}
            srcWebm={videoWebm}
            poster={poster}
            label={`${title} preview`}
            startOffset={startOffset}
          />
        ) : (
          <div className="h-full w-full" role="img" aria-label={`${title} preview`} />
        )}
      </div>
      {caption === 'inline' ? (
        <p className="mt-u1 leading-u1">
          <span className="font-medium">{title}</span>
          <span className="text-[#767676]">
            {' '}
            <span className="font-haas-display">/</span> {company}
          </span>
        </p>
      ) : (
        <p className="mt-u1 flex justify-between leading-u1">
          <span>{title}</span>
          <span className="text-[#BABABA]">{company}</span>
        </p>
      )}
    </article>
  );
}
