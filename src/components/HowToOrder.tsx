import { Link } from 'react-router-dom';
import Mark from './Mark';
import { brand } from '../data/brand';
import { isEnabled } from '../config/features';

const steps = [
  {
    num: '01',
    title: 'Escolha o caminho',
    description:
      'Monte a mesa do evento, escolhendo os antepastos, ou faça um pedido avulso para servir em casa.',
  },
  {
    num: '02',
    title: 'Entre em contato',
    description:
      'Envie sua consulta pelo WhatsApp. Nossa equipe está disponível nos horários de atendimento para ajudar.',
  },
  {
    num: '03',
    title: 'Combine os detalhes',
    description:
      `Confirme produtos, quantidades, pagamento e a data. O prazo mínimo é de ${brand.leadTimeHours} horas.`,
  },
];

export default function HowToOrder() {
  return (
    <section
      id="como-encomendar"
      aria-label="Como fazer uma encomenda"
      className="section-pad bg-cream"
    >
      <div className="container-page">
        <div className="max-w-[36rem]">
          <h2 className="section-title flex items-center gap-3 text-text">
            Como encomendar
            <Mark name="espatula" />
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-text-muted">
            Simples e direto. Todos os caminhos terminam no WhatsApp, sempre com confirmação da equipe.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {isEnabled('table') && <Link
              to="/monte-sua-mesa"
              className="inline-flex items-center justify-center rounded-full bg-olive-deep px-6 py-2.5 font-sans text-sm font-semibold text-ivory transition-colors duration-200 hover:bg-olive-mid active:scale-[0.98]"
            >
              Monte sua mesa
            </Link>}
            {isEnabled('packages') && (
              <Link
                to="/pacotes"
                className="inline-flex items-center justify-center rounded-full border border-olive-deep/30 bg-ivory px-6 py-2.5 font-sans text-sm font-semibold text-olive-deep transition-colors duration-200 hover:border-olive-deep hover:bg-beige active:scale-[0.98]"
              >
                Pacotes para eventos
              </Link>
            )}
            {isEnabled('menu') && <Link
              to="/cardapio"
              className="inline-flex items-center justify-center rounded-full border border-olive-deep/30 bg-ivory px-6 py-2.5 font-sans text-sm font-semibold text-olive-deep transition-colors duration-200 hover:border-olive-deep hover:bg-beige active:scale-[0.98]"
            >
              Cardápio avulso
            </Link>}
          </div>
        </div>

        <ol className="order-steps mt-14 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map((step) => (
            <li key={step.num} className="order-step flex flex-col">
              <div className="flex items-center gap-4">
                <span className="font-serif text-4xl font-medium leading-none text-olive-mid">
                  {step.num}
                </span>
                <span className="order-step-line" aria-hidden="true">
                  <span className="order-step-gleam" />
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-medium leading-snug text-text">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[36ch] font-sans text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-14 max-w-[62ch] border-t border-beige pt-6 font-sans text-sm leading-relaxed text-text-muted md:mt-16">
          Encomendas com no mínimo {brand.leadTimeHours} horas de antecedência. Não trabalhamos com pronta entrega.
          Pagamento em dinheiro, Pix ou cartão por link. A data e o valor se confirmam no WhatsApp.
        </p>
      </div>
    </section>
  );
}
