import { useLayoutEffect, useRef } from 'react';
import Mark from './Mark';
import Photo from './Photo';

const shots = [
  {
    src: '/images/insta/mesa-01.jpg',
    alt: 'Mesa de evento com burrata, pães, frios, frutas e flores',
  },
  {
    src: '/images/insta/mesa-05.jpg',
    alt: 'Mesa de antepastos ao ar livre, com frios, frutas e um arranjo de flores',
  },
  {
    src: '/images/insta/mesa-08.jpg',
    alt: 'Canapés, taças e uma tábua de frios com frutas em um evento',
  },
  {
    src: '/images/insta/mesa-02.jpg',
    alt: 'Mesa posta junto à janela, com salgados e frios',
  },
  {
    src: '/images/insta/mesa-03.jpg',
    alt: 'Tábua de frios, queijos e frutas em um encontro',
  },
  {
    src: '/images/insta/mesa-04.jpg',
    alt: 'Mesa de evento com flores e salgados',
  },
  {
    src: '/images/insta/mesa-06.jpg',
    alt: 'Mini hambúrgueres e prensadinhos em uma mesa de mármore',
  },
  {
    src: '/images/insta/mesa-09.jpg',
    alt: 'Canapés com presunto, cream cheese e frutas, em uma mesa de evento',
  },
  {
    src: '/images/insta/mesa-10.jpg',
    alt: 'Quiches, tábua de frios e mini hambúrgueres em um evento',
  },
  {
    src: '/images/insta/mesa-12.jpg',
    alt: 'Seleção de frios e acompanhamentos',
  },
  {
    src: '/images/insta/mesa-13.jpg',
    alt: 'Buffet de evento com salgados e frutas',
  },
  {
    src: '/images/insta/mesa-14.jpg',
    alt: 'Folhados e morangos servidos em um evento',
  },
];

const DRIFT_SPEED = 40;

function TableShot({
  shot,
  hidden = false,
}: {
  shot: (typeof shots)[number];
  hidden?: boolean;
}) {
  return (
    <li className="w-[70vw] max-w-[17.5rem] shrink-0 pr-3" aria-hidden={hidden || undefined}>
      <figure className="aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-beige">
        <Photo
          src={shot.src}
          alt={hidden ? '' : shot.alt}
          className="h-full w-full object-cover"
          sizes="18rem"
          draggable={false}
        />
      </figure>
    </li>
  );
}

export default function RealTables() {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastWidth = 0;
    const sync = () => {
      const width = group.offsetWidth;
      if (!width || width === lastWidth) return;
      lastWidth = width;
      track.style.setProperty('--loop-shift', `${width}px`);
      track.style.animationDuration = `${width / DRIFT_SPEED}s`;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-label="Mesas reais" className="section-pad bg-cream">
      <div className="container-page">
        <h2 className="section-title flex items-center gap-3 text-text">
          Mesas reais
          <Mark name="flor" />
        </h2>
        <p className="mt-5 max-w-[42ch] font-sans text-base leading-relaxed text-text-muted">
          Encontros, coffee breaks e comemorações. Veja como a mesa chega pronta.
        </p>
      </div>

      <div className="real-tables mt-8">
        <div className="real-tables-track" ref={trackRef}>
          <ul ref={groupRef} className="flex">
            {shots.map((shot) => (
              <TableShot key={shot.src} shot={shot} />
            ))}
          </ul>
          <ul className="flex" aria-hidden="true">
            {shots.map((shot) => (
              <TableShot key={`${shot.src}-loop`} shot={shot} hidden />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
