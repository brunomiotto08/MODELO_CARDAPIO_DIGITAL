import { Check, Plus } from '@phosphor-icons/react';
import type { MenuOffer } from '../data/offers';
import Photo from './Photo';

type OfferTileProps = {
  offer: MenuOffer;
  marked: boolean;
  onOpen: (offer: MenuOffer) => void;
};

export default function OfferTile({ offer, marked, onOpen }: OfferTileProps) {
  return (
    <article className="relative">
      <button
        type="button"
        onClick={() => onOpen(offer)}
        className="group w-full text-left"
        aria-haspopup="dialog"
      >
        <span className="block aspect-square overflow-hidden bg-beige">
          <Photo
            src={offer.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={offer.imagePosition ? { objectPosition: offer.imagePosition } : undefined}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
          />
        </span>
        <span className="mt-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-text-muted">
          {offer.hint}
        </span>
        <span className="mt-1 block font-serif text-lg leading-tight text-text group-hover:text-olive-deep">
          {offer.name}
        </span>
        <span className="mt-1 block font-sans text-sm font-semibold text-olive-deep">
          {offer.priceLabel}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onOpen(offer)}
        aria-haspopup="dialog"
        aria-label={marked ? `${offer.name} já escolhido. Abrir opções` : `Escolher ${offer.name}`}
        className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center transition-colors duration-200 sm:h-9 sm:w-9 ${
          marked
            ? 'bg-olive-deep text-ivory'
            : 'bg-ivory text-text-muted hover:bg-olive-deep hover:text-ivory'
        }`}
      >
        {marked ? <Check size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
      </button>
    </article>
  );
}
