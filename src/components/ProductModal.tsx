import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { X, Plus, Check, ArrowRight } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import type { Product } from '../types';
import { useOrder } from '../context/OrderContext';
import WhatsAppCTA from './WhatsAppCTA';
import QuantitySlider from './QuantitySlider';
import { buildOrderMessage } from '../data/brand';
import { categoryName, productGallery, unitRange } from '../data/catalog';
import Photo from './Photo';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToList: (product: Product, quantity?: number) => void;
  isInList: boolean;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToList,
  isInList,
}: ProductModalProps) {
  const reduce = useReducedMotion();
  const { getQuantity, setItemQuantity } = useOrder();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [shot, setShot] = useState(0);
  const gallery = product ? productGallery(product) : [];
  const range = product ? unitRange(product) : null;
  const savedQuantity = product ? getQuantity(product.id) : undefined;
  const [quantity, setQuantity] = useState(range?.min ?? 1);

  useEffect(() => {
    if (!range) return;
    setQuantity(savedQuantity && savedQuantity >= range.min ? savedQuantity : range.min);
  }, [product?.id, range?.min, range?.max, savedQuantity]);

  useEffect(() => {
    setShot(0);
  }, [product?.id]);

  /* Focus the close button when modal opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ESC to close + focus trap */
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const whatsappMessage = product
    ? buildOrderMessage([
        range ? `${product.name} — ${quantity} un.` : product.name,
      ])
    : '';

  const changeQuantity = (next: number) => {
    setQuantity(next);
    if (product && isInList) setItemQuantity(product.id, next);
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes: ${product.name}`}
          variants={overlayVariants}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{ backgroundColor: 'rgba(41,43,37,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            ref={panelRef}
            data-lenis-prevent
            className="bg-ivory w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto rounded-t-lg sm:rounded-md shadow-xl"
            variants={panelVariants}
            initial={reduce ? false : 'hidden'}
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex items-center justify-end p-4 pb-0">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-sm text-text-muted hover:text-olive-deep hover:bg-beige transition-colors"
                aria-label="Fechar detalhes do produto"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="p-5 sm:p-7 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Image */}
              <div>
                <div className="relative overflow-hidden rounded-sm aspect-[4/3] sm:aspect-square">
                  <Photo
                    src={gallery[shot] ?? product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: shot === 0 ? (product.imagePosition ?? 'center') : 'center' }}
                    sizes="(max-width: 640px) 92vw, 36vw"
                    loading="eager"
                  />
                  {product.imageKind === 'ilustrativa' && shot === 0 && (
                    <span className="absolute bottom-2 left-2 bg-text/70 px-2 py-0.5 font-sans text-[10px] text-ivory">
                      Imagem ilustrativa
                    </span>
                  )}
                </div>
                {gallery.length > 1 && (
                  <div className="mt-2 flex gap-2">
                    {gallery.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setShot(index)}
                        aria-label={`Foto ${index + 1} de ${product.name}`}
                        aria-pressed={shot === index}
                        className={`h-14 w-14 overflow-hidden border ${shot === index ? 'border-olive-deep' : 'border-beige'}`}
                      >
                        <Photo src={src} alt="" sizes="56px" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-text">
                    {product.name}
                  </h2>
                  {categoryName(product.category) !== product.name && (
                    <p className="mt-2 font-sans text-sm text-olive-mid">
                      {categoryName(product.category)}
                    </p>
                  )}
                </div>

                {product.description && (
                  <p className="font-sans text-sm text-text-muted leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Price or consult */}
                {product.variants && product.variants.length > 0 ? (
                  <div className="space-y-1 border-y border-beige py-3">
                    {product.variants.map((variant) => (
                      <p key={variant.label} className="font-sans text-sm text-text">
                        <span className="text-text-muted">{variant.label}</span>
                        <span className="ml-2 font-semibold text-olive-deep">{variant.price}</span>
                      </p>
                    ))}
                  </div>
                ) : product.price ? (
                  <div className="border-y border-beige py-3">
                    <span className="font-sans text-base font-semibold text-olive-deep">
                      {product.price}
                    </span>
                    {product.unit && (
                      <span className="ml-1 font-sans text-sm text-text-muted">
                        por {product.unit}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="border-y border-beige py-3">
                    <span className="font-sans text-sm italic text-text-muted">
                      Valores e disponibilidade sob consulta.
                    </span>
                  </div>
                )}
                {product.notes && product.notes.length > 0 && (
                  <ul className="space-y-1">
                    {product.notes.map((note) => (
                      <li key={note} className="font-sans text-xs leading-relaxed text-text-muted">
                        {note}
                      </li>
                    ))}
                  </ul>
                )}

                {range && (
                  <QuantitySlider
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={quantity}
                    onChange={changeQuantity}
                  />
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-auto">
                  <WhatsAppCTA
                    message={whatsappMessage}
                    label="Consultar encomenda"
                    variant="primary"
                    size="md"
                    className="justify-center"
                    showDemoNotice
                  />

                  <button
                    type="button"
                    onClick={() => onAddToList(product, quantity)}
                    className={`
                      inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-sans font-semibold
                      rounded-sm border transition-all duration-200 active:scale-[0.98]
                      ${isInList
                        ? 'bg-sage/50 border-olive-deep text-olive-deep'
                        : 'bg-transparent border-beige-dark text-text-muted hover:border-olive-deep hover:text-olive-deep'
                      }
                    `}
                    aria-pressed={isInList}
                  >
                    {isInList ? (
                      <>
                        <Check size={16} weight="bold" />
                        Adicionado à lista
                      </>
                    ) : (
                      <>
                        <Plus size={16} weight="bold" />
                        Adicionar à lista de interesse
                      </>
                    )}
                  </button>
                </div>

                {product.isDemonstration && (
                  <p className="font-sans text-xs text-text-light leading-relaxed">
                    {product.imageKind === 'ilustrativa'
                      ? 'Imagem ilustrativa. O nome organiza a demonstração e será confirmado no cardápio oficial.'
                      : 'Fotografia de uma mesa real. O nome organiza a demonstração e será confirmado no cardápio oficial.'}
                  </p>
                )}

                <Link
                  to="/cardapio"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-sm font-medium text-olive-mid transition-colors hover:text-olive-deep"
                >
                  <ArrowRight size={14} />
                  Ver o cardápio completo
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
