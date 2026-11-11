import { brand, genericOrderMessage } from '../data/brand';
import WhatsAppCTA from './WhatsAppCTA';

function cityList(cities: string[]): string {
  if (cities.length < 2) return cities.join('');
  return `${cities.slice(0, -1).join(', ')} e ${cities[cities.length - 1]}`;
}

const weekdayParts = brand.hours.weekdays.split(' e ');

const pieces = [
  {
    label: 'Entrega',
    value: 'Toda a Serra Gaúcha',
    note: `${cityList(brand.serviceArea)}, além do restante da serra. O valor da entrega acompanha o endereço.`,
    tone: 'sage',
  },
  {
    label: 'Retirada',
    value: 'Bairro Galópolis',
    note: 'Não temos loja física. A retirada é em Caxias do Sul, com horário agendado.',
    tone: 'lilac',
  },
  {
    label: 'Prazo',
    value: `Mínimo de ${brand.leadTimeHours} horas`,
    note: 'Sem pronta entrega. A data se confirma no atendimento.',
    tone: 'sage',
  },
  {
    label: 'Atendimento',
    value: `Seg a sex, ${weekdayParts.join(' e ')}`,
    note: `Sábado, ${brand.hours.saturday}. ${brand.hours.note}.`,
    tone: 'sage',
  },
  {
    label: 'Pagamento',
    value: 'Dinheiro, Pix ou cartão',
    note: 'O cartão é pago por link, à distância.',
    tone: 'lilac',
    wide: true,
  },
];

export default function ContactInfo() {
  return (
    <section aria-label="Informações práticas" className="order-facts">
      <div className="container-page">
        <header className="order-facts-head">
          <div className="order-facts-intro">
            <h2 className="section-title text-text">Para encomendar</h2>
            <p>
              Tudo se combina pelo WhatsApp. Estes são os combinados da casa.
            </p>
          </div>
          <WhatsAppCTA
            message={genericOrderMessage}
            label="Fazer encomenda"
            variant="primary"
            size="md"
          />
        </header>

        <dl className="order-facts-board">
          {pieces.map((piece) => (
            <div
              key={piece.label}
              className={`order-piece order-piece-${piece.tone}${piece.wide ? ' order-piece-wide' : ''}`}
            >
              <dt>{piece.label}</dt>
              <dd>
                <span className="order-value">{piece.value}</span>
                <span className="order-note">{piece.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
