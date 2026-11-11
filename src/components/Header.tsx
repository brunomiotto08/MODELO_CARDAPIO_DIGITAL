import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, WhatsappLogo, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { useOrder } from '../context/OrderContext';
import WhatsAppCTA from './WhatsAppCTA';
import BrandLogo from './BrandLogo';
import { brand, buildWhatsAppLink, genericOrderMessage } from '../data/brand';
import { headerLinks } from '../config/routes';

function RevealSlot({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{ gridTemplateColumns: open ? '1fr' : '0fr' }}
    >
      <div
        className={`min-w-0 overflow-hidden transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? 'opacity-100 delay-100' : 'pointer-events-none opacity-0 delay-0'
        }`}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}

const menuEase = [0.22, 1, 0.36, 1] as const;

const navLinks = headerLinks;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { orderCount, openPanel } = useOrder();
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const whatsappHref = buildWhatsAppLink(genericOrderMessage);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40);
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300"
        style={{
          backgroundColor: 'rgb(242, 242, 243)',
          boxShadow: scrolled ? '0 10px 28px -18px rgb(64 64 65 / 0.45)' : 'none',
          borderBottom: scrolled ? '1px solid rgb(227 227 227)' : '1px solid transparent',
        }}
      >
        <div className="container-page">
          <div className="flex h-[var(--header-bar)] items-center justify-between gap-3 sm:gap-6">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label={`${brand.name}, página inicial`}
            >
              <BrandLogo />
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-5 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={pathname === link.to ? 'page' : undefined}
                  className={`whitespace-nowrap font-sans text-sm font-medium transition-colors duration-200 hover:text-olive-deep ${
                    pathname === link.to ? 'text-olive-deep' : 'text-text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center">
              <RevealSlot open={orderCount > 0}>
                <div className="pr-3">
                  <button
                    type="button"
                    onClick={openPanel}
                    tabIndex={orderCount > 0 ? 0 : -1}
                    className="relative flex items-center gap-2 whitespace-nowrap rounded-sm border border-beige px-4 py-2 text-sm font-medium text-olive-deep transition-colors duration-200 hover:border-olive-deep"
                    aria-label={`Lista de interesse com ${orderCount} ${orderCount === 1 ? 'item' : 'itens'}`}
                  >
                    Minha lista
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-olive-deep text-xs font-bold text-ivory">
                      {orderCount}
                    </span>
                  </button>
                </div>
              </RevealSlot>
              <WhatsAppCTA message={genericOrderMessage} label="Fazer encomenda" size="sm" />
            </div>

            {/* Mobile actions */}
            <div className="flex items-center lg:hidden">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center text-olive-deep"
                  aria-label="Falar no WhatsApp"
                >
                  <WhatsappLogo size={22} weight="fill" />
                </a>
              )}
              <RevealSlot open={orderCount > 0}>
                <div className="pr-1">
                  <button
                    type="button"
                    onClick={openPanel}
                    tabIndex={orderCount > 0 ? 0 : -1}
                    className="relative flex h-11 w-11 items-center justify-center text-olive-deep"
                    aria-label={`Lista de interesse com ${orderCount} ${orderCount === 1 ? 'item' : 'itens'}`}
                  >
                    <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-olive-deep text-[10px] font-bold text-ivory">
                      {orderCount}
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </RevealSlot>
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="flex h-11 w-11 items-center justify-center text-olive-deep"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            data-lenis-prevent
            className="fixed inset-0 z-40 flex flex-col bg-ivory px-[var(--page-gutter)] pb-8 pt-[calc(var(--header-h)+1.5rem)] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: menuEase }}
          >
            <nav className="mt-4 flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: reduceMotion ? 0 : 0.42,
                      delay: reduceMotion ? 0 : 0.06 + index * 0.05,
                      ease: menuEase,
                    },
                  }}
                  exit={{ opacity: 0, y: 8, transition: { duration: reduceMotion ? 0 : 0.2, delay: 0, ease: menuEase } }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-beige pb-4 font-serif text-3xl font-medium text-text transition-colors hover:text-olive-deep"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="mt-auto pt-8"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.22, ease: menuEase },
              }}
              exit={{ opacity: 0, y: 8, transition: { duration: reduceMotion ? 0 : 0.2, delay: 0, ease: menuEase } }}
            >
              <WhatsAppCTA
                message={genericOrderMessage}
                label="Fazer encomenda"
                size="lg"
                className="w-full justify-center"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
