import { Plus, Check } from '@phosphor-icons/react';
import type { Product } from '../types';
import Photo from './Photo';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToList: (product: Product) => void;
  isInList: boolean;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToList,
  isInList,
}: ProductCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-beige bg-ivory">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="flex flex-col flex-1 text-left rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-deep focus-visible:ring-inset"
      >
        <div className="relative overflow-hidden aspect-[4/3]">
          <Photo
            src={product.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: product.imagePosition ?? 'center' }}
            sizes="(max-width: 640px) 92vw, 33vw"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          {product.imageKind === 'ilustrativa' && (
            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-text/70 text-ivory text-[10px] font-sans rounded-sm">
              Ilustrativa
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-serif text-xl font-medium leading-snug text-text transition-colors group-hover:text-olive-deep">
            {product.name}
          </h3>

          {product.description && (
            <p className="font-sans text-sm text-text-muted leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between">
            {product.variants && product.variants.length > 0 ? (
              <span className="font-sans text-sm font-semibold text-olive-deep">
                {product.variants[0].price}
                <span className="ml-1 font-normal text-text-light">/ {product.variants[0].label}</span>
              </span>
            ) : product.price ? (
              <span className="font-sans text-sm font-semibold text-olive-deep">
                {product.price}
                {product.unit && (
                  <span className="text-text-light font-normal ml-1">/ {product.unit}</span>
                )}
              </span>
            ) : (
              <span className="font-sans text-xs text-text-muted italic">Consulte valores</span>
            )}

            <span className="font-sans text-sm text-olive-mid">
              Ver detalhes
            </span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onAddToList(product)}
        aria-label={isInList ? `${product.name} adicionado à lista` : `Adicionar ${product.name} à lista`}
        aria-pressed={isInList}
        className={`
          absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center
          transition-colors duration-200
          ${isInList
            ? 'bg-olive-deep text-ivory'
            : 'bg-ivory text-text-muted hover:bg-olive-deep hover:text-ivory'
          }
        `}
      >
        {isInList ? <Check size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
      </button>
    </article>
  );
}
