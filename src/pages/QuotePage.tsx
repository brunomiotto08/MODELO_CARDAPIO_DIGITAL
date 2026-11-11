import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, WarningCircle, WhatsappLogo } from '@phosphor-icons/react';
import { scrollWithLenis } from '../components/SmoothScroll';
import ChoiceChips from '../components/ChoiceChips';
import Mark from '../components/Mark';
import QuantitySlider from '../components/QuantitySlider';
import { brand } from '../data/brand';
import { eventTypeLabel, eventTypes } from '../data/events';
import { eventPackages, packageById, packageStartingPrice } from '../data/packages';
import {
  buildQuoteMessage,
  cityLabel,
  emptyDraft,
  formatEventDate,
  isOutsideServiceArea,
  linesFrom,
  minEventDate,
  quoteOptions,
  type QuoteDraft,
} from '../data/quote';
import { isEnabled } from '../config/features';
import { useOrder } from '../context/OrderContext';
import { useTable } from '../context/TableContext';
import { formatBRL } from '../lib/money';
import { suggestQuantities } from '../lib/quantities';
import { storageKey } from '../lib/storage';
import { usePersistentState } from '../lib/usePersistentState';
import { buildWhatsAppLink } from '../lib/whatsapp';
import { useSeo } from '../seo/useSeo';

const steps = [
  { id: 'tipo', short: 'Evento', title: 'Qual é o evento?' },
  { id: 'data', short: 'Data', title: 'Quando vai ser?' },
  { id: 'convidados', short: 'Convidados', title: 'Quantas pessoas?' },
  { id: 'local', short: 'Local', title: 'Onde vai ser?' },
  { id: 'cardapio', short: 'Cardápio', title: 'O que você imagina servir?' },
  { id: 'resumo', short: 'Resumo', title: 'Confira e envie' },
] as const;

const LAST = steps.length - 1;

/** Mescla o rascunho salvo com o formato atual (campos novos ganham o padrão). */
function validateDraft(value: unknown): QuoteDraft | null {
  if (!value || typeof value !== 'object') return null;
  const draft = { ...emptyDraft, ...(value as Partial<QuoteDraft>) };
  draft.step = Math.min(LAST, Math.max(0, Number(draft.step) || 0));
  draft.restrictions = Array.isArray(draft.restrictions) ? draft.restrictions : [];
  return draft;
}

const inputClass =
  'w-full rounded-sm border border-beige bg-ivory px-3 py-2.5 font-sans text-sm text-text outline-none transition-colors focus:border-olive-deep focus-visible:ring-2 focus-visible:ring-olive-deep/30';

function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-sans text-xs font-medium text-text">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 font-sans text-[11px] leading-snug text-text-muted">{hint}</p>}
    </div>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 border border-beige bg-cream px-3 py-2.5 font-sans text-xs leading-snug text-text">
      <WarningCircle size={16} weight="regular" className="mt-px shrink-0 text-olive-deep" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export default function QuotePage() {
  useSeo('/orcamento');
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const [draft, setDraft] = usePersistentState<QuoteDraft>(storageKey('quote'), emptyDraft, {
    area: 'session',
    validate: validateDraft,
  });
  const { plateIds, getQuantity: tableQuantity } = useTable();
  const { orderItems, getQuantity: listQuantity } = useOrder();

  const update = (patch: Partial<QuoteDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const goTo = (step: number) => update({ step: Math.min(LAST, Math.max(0, step)) });

  // Pré-preenche com ?pacote=, ?convidados= e ?tipo= (vindos de pacotes e da galeria).
  useEffect(() => {
    const pkg = packageById(params.get('pacote'));
    const guests = Number(params.get('convidados'));
    const type = params.get('tipo');
    if (!pkg && !guests && !type) return;
    setDraft((current) => ({
      ...current,
      packageId: pkg?.id ?? current.packageId,
      guests: guests > 0 ? Math.min(quoteOptions.maxGuests, Math.round(guests)) : pkg ? pkg.defaultGuests : current.guests,
      eventType: type && eventTypes.some((item) => item.id === type) ? type : current.eventType,
    }));
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
    // Só na chegada à página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => scrollWithLenis(lenis, 0, true));
    return () => window.cancelAnimationFrame(frame);
  }, [lenis]);

  // Leva o foco ao título de cada nova etapa (leitores de tela anunciam a mudança).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    scrollWithLenis(lenis, 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.step]);

  const minDate = useMemo(() => minEventDate(), []);
  const tableLines = useMemo(() => linesFrom(plateIds, tableQuantity), [plateIds, tableQuantity]);
  const listLines = useMemo(() => linesFrom(orderItems, listQuantity), [orderItems, listQuantity]);
  const hasTable = isEnabled('table') && tableLines.length > 0;
  const hasList = isEnabled('menu') && listLines.length > 0;

  const valid = [
    Boolean(draft.eventType),
    Boolean(draft.date) && draft.date >= minDate && Boolean(draft.timeSlot),
    draft.guests >= 1,
    Boolean(cityLabel(draft)) && (Boolean(draft.fulfillment) || !quoteOptions.allowPickup),
    true,
    draft.name.trim().length >= 2,
  ];
  const canAdvance = valid[draft.step];
  const reachable = (index: number) => valid.slice(0, index).every(Boolean);

  const message = buildQuoteMessage(
    { ...draft, includeTable: draft.includeTable && hasTable, includeList: draft.includeList && hasList },
    { tableLines, listLines },
  );
  const whatsapp = buildWhatsAppLink(message);

  const suggestion =
    isEnabled('calculator') && draft.guests > 0
      ? suggestQuantities({ guests: draft.guests, hours: draft.hours, styleId: 'coquetel' })
      : null;

  const cityChips = [
    ...brand.serviceArea.map((city) => ({ id: city, label: city })),
    { id: quoteOptions.otherCityId, label: 'Outra cidade' },
  ];

  const packageChoices = useMemo(() => {
    const matching = eventPackages.filter((pkg) => pkg.eventTypes.includes(draft.eventType));
    const others = eventPackages.filter((pkg) => !pkg.eventTypes.includes(draft.eventType));
    return [...matching, ...others];
  }, [draft.eventType]);

  const step = steps[draft.step];
  const selectedPackage = packageById(draft.packageId);

  const stepBody: Record<(typeof steps)[number]['id'], ReactNode> = {
    tipo: (
      <ChoiceChips
        label="Tipo de evento"
        chips={eventTypes.map((type) => ({ id: type.id, label: type.label }))}
        value={draft.eventType}
        onChange={(id) => update({ eventType: id })}
      />
    ),
    data: (
      <div className="space-y-5">
        <Field
          label="Data do evento"
          htmlFor="quote-date"
          hint={`Encomendas com no mínimo ${brand.leadTimeHours} horas de antecedência. A disponibilidade se confirma no atendimento.`}
        >
          <input
            id="quote-date"
            type="date"
            min={minDate}
            value={draft.date}
            onChange={(event) => update({ date: event.target.value })}
            className={`${inputClass} max-w-[16rem]`}
          />
        </Field>
        {draft.date && draft.date < minDate && (
          <Notice>Essa data fica antes do prazo mínimo. Escolha a partir de {formatEventDate(minDate)}.</Notice>
        )}
        <ChoiceChips
          label="Horário"
          showLabel
          chips={quoteOptions.timeSlots}
          value={draft.timeSlot}
          onChange={(id) => update({ timeSlot: id })}
          size="sm"
        />
        <ChoiceChips
          label="Duração aproximada"
          showLabel
          chips={quoteOptions.durations.map((hours) => ({ id: String(hours), label: `${hours}h` }))}
          value={String(draft.hours)}
          onChange={(id) => update({ hours: Number(id) })}
          size="sm"
        />
      </div>
    ),
    convidados: (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-end">
          <QuantitySlider
            min={1}
            max={quoteOptions.maxGuests}
            value={Math.min(quoteOptions.maxGuests, draft.guests)}
            onChange={(guests) => update({ guests })}
            label="Convidados"
            unit="pessoas"
          />
          <Field label="Número exato" htmlFor="quote-guests">
            <input
              id="quote-guests"
              type="number"
              inputMode="numeric"
              min={1}
              max={quoteOptions.maxGuests}
              value={draft.guests || ''}
              onChange={(event) => {
                const value = Math.round(Number(event.target.value));
                update({ guests: Number.isFinite(value) ? Math.min(quoteOptions.maxGuests, Math.max(0, value)) : 0 });
              }}
              className={inputClass}
            />
          </Field>
        </div>
        {brand.eventMinimumGuests > 0 && draft.guests > 0 && draft.guests < brand.eventMinimumGuests && (
          <Notice>
            Eventos a partir de {brand.eventMinimumGuests} pessoas.
            {isEnabled('menu') && (
              <>
                {' '}Para encontros menores, o{' '}
                <Link to="/cardapio" className="font-semibold underline underline-offset-2">
                  cardápio avulso
                </Link>{' '}
                funciona melhor.
              </>
            )}
          </Notice>
        )}
        {suggestion && suggestion.unitTotal > 0 && (
          <p className="font-sans text-sm leading-relaxed text-text-muted">
            Referência: em um coquetel de {draft.hours}h, cerca de{' '}
            <strong className="font-semibold text-olive-deep">{suggestion.unitTotal} salgados</strong> para {draft.guests}{' '}
            {draft.guests === 1 ? 'pessoa' : 'pessoas'}. A equipe ajusta a conta ao seu evento.
          </p>
        )}
      </div>
    ),
    local: (
      <div className="space-y-5">
        <ChoiceChips
          label="Cidade"
          showLabel
          chips={cityChips}
          value={draft.city}
          onChange={(id) => update({ city: id })}
          size="sm"
        />
        {isOutsideServiceArea(draft) && (
          <>
            <Field label="Qual cidade?" htmlFor="quote-city">
              <input
                id="quote-city"
                type="text"
                autoComplete="address-level2"
                value={draft.otherCity}
                onChange={(event) => update({ otherCity: event.target.value })}
                className={`${inputClass} max-w-[20rem]`}
              />
            </Field>
            <Notice>Fora da área habitual de entrega ({brand.region}). A equipe confirma se atende e a taxa.</Notice>
          </>
        )}
        {quoteOptions.allowPickup && (
          <ChoiceChips
            label="Como prefere receber"
            showLabel
            chips={[
              { id: 'entrega', label: 'Entrega no local', detail: 'Valor conforme o endereço' },
              { id: 'retirada', label: 'Retirada', detail: brand.pickup },
            ]}
            value={draft.fulfillment}
            onChange={(id) => update({ fulfillment: id as QuoteDraft['fulfillment'] })}
            size="sm"
          />
        )}
      </div>
    ),
    cardapio: (
      <div className="space-y-6">
        {isEnabled('packages') && eventPackages.length > 0 && (
          <fieldset>
            <legend className="mb-2 font-sans text-xs font-medium text-text">Partir de um pacote? (opcional)</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {[null, ...packageChoices].map((pkg) => {
                const id = pkg?.id ?? '';
                const on = draft.packageId === id;
                const price = pkg ? packageStartingPrice(pkg) : null;
                return (
                  <button
                    key={id || 'nenhum'}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update({ packageId: id })}
                    className={`flex items-start gap-2.5 border px-3 py-2.5 text-left transition-colors ${
                      on ? 'border-olive-deep bg-olive-deep text-ivory' : 'border-beige bg-ivory text-text hover:border-olive-deep'
                    }`}
                  >
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${on ? 'border-ivory' : 'border-beige-dark'}`}>
                      {on && <span className="h-2 w-2 rounded-full bg-ivory" />}
                    </span>
                    <span>
                      <span className="block font-sans text-sm font-semibold leading-snug">{pkg ? pkg.name : 'Sem pacote: quero sugestões'}</span>
                      <span className={`block font-sans text-[11px] leading-snug ${on ? 'text-ivory/80' : 'text-text-muted'}`}>
                        {pkg
                          ? price !== null
                            ? `cerca de ${formatBRL(price)} por pessoa`
                            : 'valor sob consulta'
                          : 'A equipe monta o cardápio com você'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {(hasTable || hasList) && (
          <fieldset className="space-y-2">
            <legend className="mb-2 font-sans text-xs font-medium text-text">Incluir o que você já escolheu no site</legend>
            {hasTable && (
              <label className="flex items-start gap-2.5 font-sans text-sm text-text">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-[var(--color-olive-deep)]"
                  checked={draft.includeTable}
                  onChange={(event) => update({ includeTable: event.target.checked })}
                />
                <span>Mesa montada ({tableLines.length} {tableLines.length === 1 ? 'item' : 'itens'})</span>
              </label>
            )}
            {hasList && (
              <label className="flex items-start gap-2.5 font-sans text-sm text-text">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-[var(--color-olive-deep)]"
                  checked={draft.includeList}
                  onChange={(event) => update({ includeList: event.target.checked })}
                />
                <span>Lista do cardápio ({listLines.length} {listLines.length === 1 ? 'item' : 'itens'})</span>
              </label>
            )}
          </fieldset>
        )}

        <ChoiceChips
          label="Algum cuidado com o público?"
          showLabel
          chips={quoteOptions.restrictions}
          value={draft.restrictions}
          onChange={(id) =>
            update({
              restrictions: draft.restrictions.includes(id)
                ? draft.restrictions.filter((item) => item !== id)
                : [...draft.restrictions, id],
            })
          }
          size="sm"
        />

        <Field label="Observações (opcional)" htmlFor="quote-notes">
          <textarea
            id="quote-notes"
            rows={4}
            value={draft.notes}
            onChange={(event) => update({ notes: event.target.value })}
            placeholder="Tema da festa, itens que não podem faltar, estrutura do local..."
            className={`${inputClass} resize-y`}
          />
        </Field>
      </div>
    ),
    resumo: (
      <div className="space-y-6">
        <dl className="divide-y divide-beige border-y border-beige">
          {[
            { label: 'Evento', value: draft.eventType ? eventTypeLabel(draft.eventType) : '—', step: 0 },
            {
              label: 'Data',
              value: [
                draft.date ? formatEventDate(draft.date) : '—',
                quoteOptions.timeSlots.find((slot) => slot.id === draft.timeSlot)?.label,
                `cerca de ${draft.hours}h`,
              ]
                .filter(Boolean)
                .join(' · '),
              step: 1,
            },
            { label: 'Convidados', value: `${draft.guests} pessoas`, step: 2 },
            {
              label: 'Local',
              value: [cityLabel(draft) || '—', draft.fulfillment === 'entrega' ? 'entrega' : draft.fulfillment === 'retirada' ? 'retirada' : '']
                .filter(Boolean)
                .join(' · '),
              step: 3,
            },
            {
              label: 'Cardápio',
              value:
                [
                  selectedPackage ? `Pacote ${selectedPackage.name}` : 'Sem pacote',
                  draft.includeTable && hasTable ? 'mesa montada' : '',
                  draft.includeList && hasList ? 'lista do cardápio' : '',
                  draft.restrictions.length ? `${draft.restrictions.length} cuidado(s) com o público` : '',
                ]
                  .filter(Boolean)
                  .join(' · '),
              step: 4,
            },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-2.5">
              <dt className="font-sans text-xs uppercase tracking-[0.12em] text-text-muted">{row.label}</dt>
              <dd className="font-sans text-sm text-text">{row.value}</dd>
              <dd>
                <button
                  type="button"
                  onClick={() => goTo(row.step)}
                  className="font-sans text-xs font-semibold text-olive-deep underline-offset-2 hover:underline"
                  aria-label={`Editar ${row.label.toLowerCase()}`}
                >
                  Editar
                </button>
              </dd>
            </div>
          ))}
        </dl>

        <Field label="Seu nome" htmlFor="quote-name">
          <input
            id="quote-name"
            type="text"
            autoComplete="name"
            value={draft.name}
            onChange={(event) => update({ name: event.target.value })}
            className={`${inputClass} max-w-[22rem]`}
          />
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {whatsapp && valid.every(Boolean) ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-6 py-3 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid active:scale-[0.98]"
            >
              <WhatsappLogo size={18} weight="fill" />
              Enviar pelo WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-sm bg-olive-deep/40 px-6 py-3 font-sans text-sm font-semibold text-ivory"
            >
              <WhatsappLogo size={18} weight="fill" />
              Enviar pelo WhatsApp
            </button>
          )}
          <button
            type="button"
            onClick={() => setDraft({ ...emptyDraft })}
            className="font-sans text-sm font-medium text-text-muted underline-offset-2 hover:text-text hover:underline"
          >
            Começar de novo
          </button>
        </div>
        {!valid.every(Boolean) && (
          <p className="font-sans text-xs text-text-muted">
            {draft.name.trim().length < 2 ? 'Informe seu nome para enviar.' : 'Complete as etapas marcadas para enviar.'}
          </p>
        )}

        <details className="border border-beige bg-cream">
          <summary className="cursor-pointer px-3 py-2 font-sans text-xs font-semibold text-olive-deep">
            Ver a mensagem que será enviada
          </summary>
          <pre className="whitespace-pre-wrap break-words px-3 pb-3 font-sans text-xs leading-relaxed text-text">{message}</pre>
        </details>
      </div>
    ),
  };

  return (
    <main className="bg-ivory pt-[var(--header-h)]">
      <div className="container-page pb-20 pt-10 md:pt-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-olive-mid transition-colors hover:text-olive-deep"
        >
          <ArrowLeft size={16} weight="bold" />
          Voltar ao início
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[16rem_minmax(0,40rem)] lg:gap-16">
          <div>
            <div className="flex items-center gap-2">
              <Mark name="flor" />
              <h1 className="font-serif text-4xl font-medium leading-none text-text">Orçamento</h1>
            </div>
            <p className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
              Seis passos rápidos. No fim, a {brand.name} recebe o briefing completo pelo WhatsApp e responde com a proposta.
            </p>

            <ol className="mt-6 grid grid-cols-6 gap-1.5 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-beige" aria-label="Etapas">
              {steps.map((item, index) => {
                const current = index === draft.step;
                const done = index < draft.step && valid[index];
                const enabled = reachable(index);
                return (
                  <li key={item.id} className="lg:border-b lg:border-beige">
                    <button
                      type="button"
                      onClick={() => enabled && goTo(index)}
                      disabled={!enabled}
                      aria-current={current ? 'step' : undefined}
                      aria-label={`Etapa ${index + 1}: ${item.short}${done ? ', concluída' : ''}`}
                      className="group flex w-full flex-col gap-1.5 text-left disabled:cursor-not-allowed lg:min-h-11 lg:flex-row lg:items-center lg:gap-3 lg:py-2"
                    >
                      <span
                        className={`block h-1 w-full transition-colors lg:hidden ${
                          current ? 'bg-olive-deep' : done ? 'bg-olive-mid' : 'bg-beige'
                        }`}
                      />
                      <span
                        className={`hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border font-sans text-[11px] font-semibold lg:flex ${
                          current
                            ? 'border-olive-deep bg-olive-deep text-ivory'
                            : done
                              ? 'border-olive-deep text-olive-deep'
                              : 'border-beige text-text-muted'
                        }`}
                      >
                        {done ? <Check size={12} weight="bold" /> : index + 1}
                      </span>
                      <span
                        className={`hidden font-sans text-sm lg:block ${current ? 'font-semibold text-text' : 'text-text-muted group-hover:text-text'}`}
                      >
                        {item.short}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <section aria-labelledby="quote-step-title" className="min-w-0">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-text-muted">
              Etapa {draft.step + 1} de {steps.length}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  id="quote-step-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1 font-serif text-3xl font-medium leading-tight text-text outline-none"
                >
                  {step.title}
                </h2>
                <div className="mt-6">{stepBody[step.id]}</div>
              </motion.div>
            </AnimatePresence>

            {draft.step < LAST && (
              <div className="mt-10 flex items-center justify-between gap-3 border-t border-beige pt-5">
                <button
                  type="button"
                  onClick={() => goTo(draft.step - 1)}
                  disabled={draft.step === 0}
                  className="inline-flex items-center gap-2 px-1 py-2 font-sans text-sm font-semibold text-olive-deep disabled:invisible"
                >
                  <ArrowLeft size={16} weight="bold" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => goTo(draft.step + 1)}
                  disabled={!canAdvance}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-6 py-3 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            )}
            {draft.step === LAST && (
              <button
                type="button"
                onClick={() => goTo(draft.step - 1)}
                className="mt-8 inline-flex items-center gap-2 px-1 py-2 font-sans text-sm font-semibold text-olive-deep"
              >
                <ArrowLeft size={16} weight="bold" />
                Voltar
              </button>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
