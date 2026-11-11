import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { notFoundSeo } from '../seo/site';
import { useSeo } from '../seo/useSeo';

export default function NotFoundPage() {
  useSeo(notFoundSeo.path);

  return (
    <main className="bg-ivory pt-[var(--header-h)]">
      <div className="container-page pb-24 pt-16 md:pt-24">
        <h1 className="font-serif text-4xl font-medium leading-tight text-text sm:text-5xl">
          Página não encontrada
        </h1>
        <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-text-muted">
          O endereço que você abriu não existe. Volte ao início ou veja o cardápio da Flor Alecrim.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-6 py-3 font-sans text-sm font-semibold tracking-wide text-ivory transition-colors duration-200 hover:bg-olive-mid"
          >
            Ir para o início
          </Link>
          <Link
            to="/cardapio"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-olive-deep"
          >
            Ver o cardápio
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </main>
  );
}
