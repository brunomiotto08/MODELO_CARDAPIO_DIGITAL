import { useEffect, useRef, type ReactNode } from 'react';
import { X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** Nome acessível do diálogo. */
  label: string;
  children: ReactNode;
  /** Classe de largura do painel no desktop. */
  widthClass?: string;
  /** Fundo do painel. */
  panelClass?: string;
};

/**
 * Diálogo modal genérico (mesmo comportamento do OfferModal): folha inferior no
 * celular, caixa central no desktop, Esc fecha, foco preso dentro do painel.
 */
export default function Dialog({
  open,
  onClose,
  label,
  children,
  widthClass = 'sm:max-w-xl',
  panelClass = 'bg-ivory',
}: DialogProps) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    return () => {
      window.cancelAnimationFrame(frame);
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          style={{ backgroundColor: 'rgba(41,43,37,0.45)' }}
        >
          <motion.div
            ref={panelRef}
            data-lenis-prevent
            className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-t-lg shadow-xl sm:rounded-md ${widthClass} ${panelClass}`}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-sm bg-ivory/90 text-text-muted transition-colors hover:bg-beige hover:text-olive-deep"
              aria-label="Fechar"
            >
              <X size={18} weight="bold" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
