import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, WhatsappLogo } from '@phosphor-icons/react';
import {
  buildPackageMessage,
  clampGuests,
  resolvePackage,
  type EventPackage,
} from '../../data/packages';
import { menuLine } from '../../data/offers';
import { siteConfig } from '../../config/site.config';
import { isEnabled } from '../../config/features';
import { useTable } from '../../context/TableContext';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { formatBRL } from '../../lib/money';
import Dialog from '../Dialog';
import Photo from '../Photo';
import QuantitySlider from '../QuantitySlider';

type PackageModalProps = {
  pkg: EventPackage | null;
  onClose: () => void;
  /** Convidados iniciais (ex.: vindos da URL). */
  initialGuests?: number;
};

/** Adicionais que viram os extras de "Monte sua mesa". */
const tableExtras: Record<string, 'sweets' | 'flowers'> = {
  doces: 'sweets',
  'arranjo-floral': 'flowers',
};

export default function PackageModal({ pkg: openPkg, onClose, initialGuests }: PackageModalProps) {
  const navigate = useNavigate();
  const { applyPlates, setSweets, setFlowers } = useTable();
  const [guests, setGuests] = useState(openPkg?.defaultGuests ?? 0);
  const [addons, setAddons] = useState<string[]>([]);
  // Mantém o último pacote na tela durante a animação de saída.
  const [last, setLast] = useState<EventPackage | null>(null);

  if (openPkg && openPkg !== last) {
    setLast(openPkg);
    setGuests(clampGuests(openPkg, initialGuests ?? openPkg.defaultGuests));
    setAddons([]);
  }

  const pkg = openPkg ?? last;
  const resolved = useMemo(() => (pkg ? resolvePackage(pkg, guests, addons) : null), [pkg, guests, addons]);

  if (!pkg || !resolved) return null;

  const whatsapp = buildWhatsAppLink(buildPackageMessage(pkg, guests, resolved));
  const tableLines = resolved.lines.filter((line) => line.key && line.quantity);
  const overLimit = tableLines.some((line) => {
    const menu = line.key ? menuLine(line.key) : null;
    return Boolean(menu && line.quantity && line.quantity > menu.max);
  });

  const toggleAddon = (id: string) =>
    setAddons((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const customizeOnTable = () => {
    const quantities: Record<string, number> = {};
    for (const line of tableLines) if (line.key && line.quantity) quantities[line.key] = line.quantity;
    applyPlates(Object.keys(quantities), quantities);
    setSweets(addons.some((id) => tableExtras[id] === 'sweets'));
    setFlowers(addons.some((id) => tableExtras[id] === 'flowers'));
    onClose();
    navigate('/monte-sua-mesa');
  };

  const openQuote = () => {
    onClose();
    navigate(`/orcamento?pacote=${encodeURIComponent(pkg.id)}&convidados=${guests}`);
  };

  return (
    <Dialog open={Boolean(openPkg)} onClose={onClose} label={pkg.name} widthClass="sm:max-w-2xl">
      <div className="grid sm:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="relative aspect-[16/9] overflow-hidden bg-beige sm:aspect-auto">
          <Photo
            src={pkg.image}
            alt={pkg.imageAlt}
            className="h-full w-full object-cover"
            style={pkg.imagePosition ? { objectPosition: pkg.imagePosition } : undefined}
            sizes="(max-width: 640px) 100vw, 13rem"
            loading="eager"
          />
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="pr-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-olive-mid">Pacote</p>
            <h2 className="font-serif text-2xl font-medium leading-tight text-text">{pkg.name}</h2>
            <p className="mt-1 font-sans text-sm leading-relaxed text-text-muted">{pkg.tagline}</p>
          </div>

          <QuantitySlider
            min={pkg.minGuests}
            max={pkg.maxGuests}
            step={pkg.guestStep ?? 1}
            value={guests}
            onChange={setGuests}
            label="Convidados"
            unit="pessoas"
          />

          <section aria-label="Composição">
            <h3 className="font-sans text-xs font-medium text-text">Composição para {guests} convidados</h3>
            <ul className="mt-2 divide-y divide-beige border-y border-beige">
              {resolved.lines.map((line) => (
                <li key={`${line.key ?? line.name}-${line.addon ?? ''}`} className="flex items-baseline justify-between gap-3 py-1.5">
                  <span className="min-w-0 font-sans text-[13px] leading-snug text-text">
                    {line.name}
                    {line.addon && <span className="text-text-muted"> · adicional</span>}
                  </span>
                  <span className="shrink-0 font-sans text-[13px] font-medium tabular-nums text-olive-deep">
                    {line.quantity ? `${line.quantity} un.` : 'sob consulta'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {pkg.addons?.length ? (
            <fieldset>
              <legend className="font-sans text-xs font-medium text-text">Adicionais</legend>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {pkg.addons.map((addon) => {
                  const on = addons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-start gap-2 border px-2.5 py-2 text-left transition-colors ${
                        on ? 'border-olive-deep bg-olive-deep text-ivory' : 'border-beige bg-ivory text-text hover:border-olive-deep'
                      }`}
                    >
                      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${on ? 'border-ivory' : 'border-beige-dark'}`}>
                        {on && <Check size={11} weight="bold" />}
                      </span>
                      <span>
                        <span className="block font-sans text-[13px] font-medium leading-snug">{addon.label}</span>
                        {addon.description && (
                          <span className={`block font-sans text-[11px] leading-snug ${on ? 'text-ivory/80' : 'text-text-muted'}`}>
                            {addon.description}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {(pkg.includes?.length || pkg.notes?.length) ? (
            <ul className="space-y-1 font-sans text-xs leading-snug text-text-muted">
              {pkg.includes?.map((item) => <li key={item}>Inclui: {item}</li>)}
              {pkg.notes?.map((note) => <li key={note}>{note}</li>)}
            </ul>
          ) : null}

          <div className="border-t border-beige pt-3" aria-live="polite">
            {resolved.total !== null ? (
              <>
                <p className="font-sans text-xs text-text-muted">Estimativa para {guests} convidados</p>
                <p className="font-serif text-2xl font-medium tabular-nums text-text">
                  {formatBRL(resolved.total)}
                  {resolved.perGuest !== null && (
                    <span className="ml-2 font-sans text-sm font-normal text-text-muted">
                      cerca de {formatBRL(resolved.perGuest)} por pessoa
                    </span>
                  )}
                </p>
                <p className="mt-1 font-sans text-[11px] leading-snug text-text-muted">
                  {siteConfig.packages.priceDisclaimer}
                  {!resolved.complete && ' Itens sob consulta não entram na soma.'}
                </p>
              </>
            ) : (
              <p className="font-sans text-sm text-text-muted">Valores sob consulta, confirmados no atendimento.</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-5 py-2.5 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid active:scale-[0.98]"
              >
                <WhatsappLogo size={18} weight="fill" />
                Pedir este pacote
              </a>
            ) : (
              <button type="button" disabled className="inline-flex cursor-not-allowed items-center justify-center rounded-sm bg-olive-deep/40 px-5 py-2.5 font-sans text-sm font-semibold text-ivory">
                Pedir este pacote
              </button>
            )}
            {isEnabled('table') && (
              <button
                type="button"
                onClick={customizeOnTable}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-olive-deep px-5 py-2.5 font-sans text-sm font-semibold text-olive-deep transition-colors hover:bg-olive-deep hover:text-ivory"
              >
                Personalizar na mesa
              </button>
            )}
            {isEnabled('quoteWizard') && (
              <button
                type="button"
                onClick={openQuote}
                className="inline-flex items-center justify-center gap-1.5 px-2 py-2.5 font-sans text-sm font-semibold text-olive-deep underline-offset-4 hover:underline"
              >
                Orçamento detalhado
                <ArrowRight size={14} weight="bold" />
              </button>
            )}
          </div>
          {isEnabled('table') && overLimit && (
            <p className="font-sans text-[11px] leading-snug text-text-muted">
              Em Monte sua mesa, algumas quantidades ficam no limite de cada item. A equipe ajusta no atendimento.
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
