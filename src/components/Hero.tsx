import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import WhatsAppCTA from './WhatsAppCTA';
import Mark from './Mark';
import { brand, genericOrderMessage } from '../data/brand';
import { imageAttrs } from '../lib/images';
import { isEnabled } from '../config/features';

/** CTA principal: a primeira feature de montagem ligada. */
const primary = isEnabled('table')
  ? { to: '/monte-sua-mesa', label: 'Monte sua mesa' }
  : isEnabled('packages')
    ? { to: '/pacotes', label: 'Ver pacotes' }
    : isEnabled('menu')
      ? { to: '/cardapio', label: 'Ver cardápio' }
      : null;
const showMenuLink = isEnabled('menu') && primary?.to !== '/cardapio';

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-label={`Apresentação da ${brand.name}`}
      className="hero-frame bg-ivory pt-[var(--header-h)]"
    >
      <div className="hero-stage">
        <div className="hero-visual">
          <img
            className="hero-photo"
            {...imageAttrs('/images/hero/hero.jpg', '(max-width: 1023px) 100vw, 56vw')}
            alt="Mesa posta para um encontro, com salgados, frutas, pães e arranjos de flores"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-veil" aria-hidden="true" />
          <img
            className="hero-mark"
            {...imageAttrs('/images/logos/logo-color.png', '(max-width: 1023px) 10rem, 15rem')}
            alt=""
            aria-hidden="true"
          />
        </div>
        <div className="hero-copy">
          <h1
            className="hero-title font-serif font-medium tracking-[-0.02em] text-text"
          >
            <span>Pequenos <em className="font-light italic">detalhes.</em></span>
            <span>Grandes momentos</span>
            <span>à mesa.</span>
          </h1>

          <p
            className="hero-lead max-w-[38ch] font-sans text-base leading-relaxed text-text-muted sm:text-[1.05rem]"
          >
            A {brand.name} faz salgados, antepastos e mesas para eventos sob encomenda em Caxias do Sul. Você escolhe os itens, e a gente confirma quantidades e valores pelo WhatsApp.
          </p>

          <div
            className="hero-actions flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-3"
          >
            {primary && (
              <Link
                to={primary.to}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-olive-deep px-6 py-3 font-sans text-sm font-semibold tracking-wide text-ivory transition-colors duration-200 hover:bg-olive-mid"
              >
                {primary.label}
                <ArrowRight size={16} weight="bold" />
              </Link>
            )}
            <WhatsAppCTA
              message={genericOrderMessage}
              label="Falar no WhatsApp"
              variant="outline"
              size="md"
            />
          </div>

          {showMenuLink && (
            <Link
              to="/cardapio"
              className="hero-menu inline-flex items-center gap-2 font-sans text-sm font-semibold text-olive-deep"
            >
              Cardápio avulso
              <ArrowRight size={16} weight="bold" />
            </Link>
          )}

          <p
            className="hero-note flex items-center gap-2.5 font-sans text-sm text-text-muted"
          >
            <Mark name="flor" />
            {brand.region}.
          </p>
        </div>
      </div>
    </section>
  );
}
