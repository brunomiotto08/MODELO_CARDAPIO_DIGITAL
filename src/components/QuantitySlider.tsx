interface QuantitySliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  dense?: boolean;
}

export default function QuantitySlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label = 'Quantidade',
  dense = false,
}: QuantitySliderProps) {
  const span = Math.max(max - min, 1);
  const percent = ((value - min) / span) * 100;

  return (
    <div className={`min-w-0 ${dense ? 'space-y-1' : 'space-y-2'}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-sans text-sm leading-5 text-text">{label}</span>
        <output className="font-sans text-sm font-medium tabular-nums text-olive-deep">
          {value} un.
        </output>
      </div>
      <input
        type="range"
        className="qty-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ ['--qty' as string]: `${percent}%` }}
      />
      {!dense && (
        <div className="flex justify-between font-sans text-[11px] tabular-nums text-text-light">
          <span>Mín. {min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
