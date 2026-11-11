import { WhatsappLogo } from '@phosphor-icons/react';
import { buildWhatsAppLink } from '../data/brand';

interface WhatsAppCTAProps {
  message: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDemoNotice?: boolean;
}

export default function WhatsAppCTA({
  message,
  label = 'Fazer encomenda',
  variant = 'primary',
  size = 'md',
  className = '',
  showDemoNotice = false,
}: WhatsAppCTAProps) {
  const link = buildWhatsAppLink(message);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-sm gap-2.5',
    lg: 'px-8 py-4 text-base gap-3',
  };

  const variantClasses = {
    primary:
      'bg-sage text-olive-deep border border-sage hover:bg-olive-deep hover:text-ivory hover:border-olive-deep active:scale-[0.98]',
    outline:
      'bg-transparent text-olive-deep border border-olive-deep hover:bg-olive-deep hover:text-ivory active:scale-[0.98]',
    ghost:
      'bg-transparent text-olive-deep hover:underline underline-offset-4 active:scale-[0.98]',
  };

  const baseClasses = `
    inline-flex items-center justify-center whitespace-nowrap font-sans font-semibold
    rounded-sm tracking-wide transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-deep focus-visible:ring-offset-2
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `.trim();

  if (!link) {
    const disabledClasses = `
      inline-flex items-center justify-center whitespace-nowrap font-sans font-semibold
      rounded-sm tracking-wide border border-olive-deep/40 bg-transparent text-olive-mid
      cursor-not-allowed ${sizeClasses[size]} ${className}
    `.trim();

    return (
      <div className="flex flex-col items-start gap-1">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Configure o número de WhatsApp em src/config/site.config.ts antes de publicar"
          className={disabledClasses}
        >
          <WhatsappLogo size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20} weight="fill" />
          {label}
        </button>
        {showDemoNotice && (
          <p className="max-w-[16rem] text-sm leading-relaxed text-text-muted">
            O WhatsApp ainda não está configurado.
          </p>
        )}
      </div>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
    >
      <WhatsappLogo size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20} weight="fill" />
      {label}
    </a>
  );
}
