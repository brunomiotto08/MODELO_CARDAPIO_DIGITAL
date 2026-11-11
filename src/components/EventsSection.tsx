import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import WhatsAppCTA from './WhatsAppCTA';
import Mark from './Mark';
import Photo from './Photo';
import PackageCard from './packages/PackageCard';
import { brand, eventQuoteMessage } from '../data/brand';
import { eventOffer } from '../data/catalog';
import { eventPackages } from '../data/packages';
import { isEnabled } from '../config/features';

const featured = isEnabled('packages') ? eventPackages.filter((pkg) => pkg.featuredOnHome).slice(0, 3) : [];

export default function EventsSection() {
  const navigate = useNavigate();

  return (
    <section id="eventos" aria-label="Encomendas para eventos" className="events section-pad bg-sage text-text">
      <div className="container-page events-layout">
        <div className="events-head">
          <h2 className="section-title events-title">
            <span>Seu próximo encontro</span>
            <span>
              <em>merece uma mesa</em> especial.
            </span>
          </h2>
          <p className="events-fact">
            <Mark name="flor" tone="white" className="events-mark" />
            <span>
              {eventOffer.minimum} Atendemos a {brand.region}.
            </span>
          </p>
        </div>

        <div className="events-stage">
          <div className="events-copy">
            <ul className="events-types">
              {eventOffer.types.map((type) => (
                <li key={type}>{type}</li>
              ))}
            </ul>

            <div className="events-foot">
              <p className="events-note">{eventOffer.note}</p>
              <div className="events-actions">
                {isEnabled('quoteWizard') ? (
                  <Link
                    to="/orcamento"
                    className="events-cta inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-sm border border-olive-deep px-6 py-3 font-sans text-sm font-semibold tracking-wide text-olive-deep transition-all duration-200 hover:bg-olive-deep hover:text-ivory active:scale-[0.98]"
                  >
                    Solicitar orçamento
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                ) : (
                  <WhatsAppCTA
                    message={eventQuoteMessage}
                    label="Solicitar orçamento"
                    variant="outline"
                    size="md"
                    className="events-cta"
                  />
                )}
                {isEnabled('table') && (
                  <Link to="/monte-sua-mesa" className="events-alt">
                    Ou monte a mesa por aqui
                  </Link>
                )}
              </div>
            </div>
          </div>

          <figure className="events-photo">
            <Photo
              src="/images/insta/mesa-05.jpg"
              alt="Mesa de antepastos ao ar livre, com frios, frutas e um arranjo de flores"
              className="events-photo-img"
              sizes="(max-width: 1099px) 92vw, 26rem"
            />
          </figure>
        </div>

        {featured.length > 0 && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-text/20 pt-6">
              <h3 className="font-serif text-2xl font-medium text-text">Pacotes prontos</h3>
              <Link to="/pacotes" className="events-alt">
                Ver todos os pacotes
              </Link>
            </div>
            <ul className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg) => (
                <li key={pkg.id}>
                  <PackageCard pkg={pkg} compact onOpen={(item) => navigate(`/pacotes?pacote=${item.id}`)} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="events-legal">
          Pedidos sob encomenda. Disponibilidade e condições confirmadas no atendimento.
        </p>
      </div>
    </section>
  );
}
