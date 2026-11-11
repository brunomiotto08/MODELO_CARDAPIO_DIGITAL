export type Chip = { id: string; label: string; detail?: string };

type ChoiceChipsProps = {
  chips: Chip[];
  /** Um id (escolha única) ou vários (múltipla escolha). */
  value: string | readonly string[];
  onChange: (id: string) => void;
  label: string;
  /** Mostra o rótulo do grupo na tela (senão, só para leitores de tela). */
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

/** Botões de escolha no padrão do site (borda bege, preenchido quando ativo). */
export default function ChoiceChips({
  chips,
  value,
  onChange,
  label,
  showLabel = false,
  size = 'md',
  className = '',
}: ChoiceChipsProps) {
  const isOn = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id);
  const pad = size === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-4 py-2 text-sm';

  return (
    <div role="group" aria-label={label} className={className}>
      {showLabel && <p className="mb-2 font-sans text-xs font-medium text-text">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const on = isOn(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(chip.id)}
              className={`min-h-10 rounded-sm border text-left font-sans font-semibold transition-colors ${pad} ${
                on
                  ? 'border-olive-deep bg-olive-deep text-ivory'
                  : 'border-beige bg-ivory text-text hover:border-olive-deep'
              }`}
            >
              <span className="block leading-snug">{chip.label}</span>
              {chip.detail && (
                <span className={`mt-0.5 block text-[11px] font-normal leading-snug ${on ? 'text-ivory/80' : 'text-text-muted'}`}>
                  {chip.detail}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
