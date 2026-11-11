import { ArrowRight, UsersThree } from '@phosphor-icons/react';
import { packageStartingPrice, type EventPackage } from '../../data/packages';
import { formatBRL } from '../../lib/money';
import Photo from '../Photo';

type PackageCardProps = {
  pkg: EventPackage;
  onOpen: (pkg: EventPackage) => void;
  /** Versão menor, usada na home. */
  compact?: boolean;
};

export default function PackageCard({ pkg, onOpen, compact = false }: PackageCardProps) {
  const price = packageStartingPrice(pkg);

  return (
    <article className="h-full">
      <button
        type="button"
        onClick={() => onOpen(pkg)}
        aria-haspopup="dialog"
        className="group flex h-full w-full flex-col text-left"
      >
        <span className={`relative block overflow-hidden bg-beige ${compact ? 'aspect-[4/3]' : 'aspect-[4/3] xl:aspect-[4/5]'}`}>
          <Photo
            src={pkg.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={pkg.imagePosition ? { objectPosition: pkg.imagePosition } : undefined}
            sizes={compact ? '(max-width: 700px) 80vw, 22rem' : '(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 22vw'}
          />
          {pkg.highlight && (
            <span className="absolute left-2 top-2 bg-olive-deep px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory">
              {pkg.highlight}
            </span>
          )}
        </span>
        <span className="mt-3 flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.14em] text-text-muted">
          <UsersThree size={14} weight="regular" aria-hidden="true" />
          {pkg.minGuests} a {pkg.maxGuests} convidados
        </span>
        <span className="mt-1 block font-serif text-xl font-medium leading-tight text-text group-hover:text-olive-deep">
          {pkg.name}
        </span>
        {!compact && (
          <span className="mt-1.5 block font-sans text-sm leading-relaxed text-text-muted">{pkg.tagline}</span>
        )}
        <span className="mt-auto flex items-end justify-between gap-3 pt-3">
          {price !== null ? (
            <span className="font-sans leading-tight">
              <span className="block text-[11px] text-text-muted">cerca de</span>
              <span className="whitespace-nowrap text-sm font-semibold text-olive-deep">
                {formatBRL(price)}
                <span className="font-normal text-text-muted"> / pessoa</span>
              </span>
            </span>
          ) : (
            <span className="font-sans text-sm font-semibold text-olive-deep">Valor sob consulta</span>
          )}
          <span className="inline-flex shrink-0 items-center gap-1 font-sans text-xs font-semibold text-olive-deep">
            Ver pacote
            <ArrowRight size={14} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </button>
    </article>
  );
}
