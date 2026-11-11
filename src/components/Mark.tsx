import Photo from './Photo';

type MarkProps = {
  name: 'flor' | 'espatula';
  tone?: 'color' | 'white';
  className?: string;
};

const sources = {
  flor: {
    color: '/images/logos/micros/flor.png',
    white: '/images/logos/micros/flor-white.png',
  },
  espatula: {
    color: '/images/logos/micros/fue.png',
    white: '/images/logos/micros/fue.png',
  },
};

export default function Mark({ name, tone = 'color', className = '' }: MarkProps) {
  const frame = name === 'flor' ? 'h-6 w-6' : 'h-5 w-10';

  return (
    <Photo
      src={sources[name][tone]}
      alt=""
      aria-hidden="true"
      sizes="48px"
      loading="eager"
      fetchPriority="low"
      className={`pointer-events-none select-none object-contain ${frame} ${className}`}
    />
  );
}
