import { Link } from 'react-router-dom';
import { InstagramLogo } from '@phosphor-icons/react';
import { brand } from '../data/brand';
import BrandLogo from './BrandLogo';
import { footerLinks } from '../config/routes';

export default function Footer() {
  return (
    <footer
      aria-label="Rodapé"
      className="bg-sage py-16 text-text md:py-20"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-16">
          <Link
            to="/"
            className="inline-flex self-start transition-opacity hover:opacity-90"
            aria-label={`${brand.name}, página inicial`}
          >
            <BrandLogo variant="footer" />
          </Link>

          <div className="flex max-w-sm flex-col gap-3 lg:pt-2">
            <p className="font-sans text-sm leading-relaxed text-text">
              Ingredientes selecionados, de altíssima qualidade, preparados sob encomenda
              para a sua mesa.
            </p>
            <p className="font-sans text-sm text-text-muted">
              {brand.city} · {brand.region}
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Links do rodapé" className="flex flex-col gap-3 lg:pt-2">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-sans text-sm text-text transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://www.instagram.com/${brand.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-sm text-text transition-colors hover:underline"
              aria-label={`Instagram @${brand.instagram}`}
            >
              <InstagramLogo size={14} weight="regular" />
              @{brand.instagram}
            </a>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-text/15 pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-sm text-text-muted">
            Pedidos sujeitos a confirmação de disponibilidade e condições.
          </p>
          <p className="font-sans text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {brand.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
