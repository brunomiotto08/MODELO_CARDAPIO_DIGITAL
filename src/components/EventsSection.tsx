import { Link } from 'react-router-dom';
import WhatsAppCTA from './WhatsAppCTA';
import Mark from './Mark';
import Photo from './Photo';
import { brand } from '../data/brand';
import { eventOffer } from '../data/catalog';

const budgetMessage =
  'Olá! Gostaria de solicitar um orçamento para um evento com a Flor Alecrim.';

export default function EventsSection() {
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
                <WhatsAppCTA
                  message={budgetMessage}
                  label="Solicitar orçamento"
                  variant="outline"
                  size="md"
                  className="events-cta"
                />
                <Link to="/monte-sua-mesa" className="events-alt">
                  Ou monte a mesa por aqui
                </Link>
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

        <p className="events-legal">
          Pedidos sob encomenda. Disponibilidade e condições confirmadas no atendimento.
        </p>
      </div>
    </section>
  );
}
