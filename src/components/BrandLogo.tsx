import Photo from './Photo';

type BrandLogoProps = {
  variant?: 'header' | 'footer';
};

const sizes = {
  header: 'h-11 w-auto sm:h-12',
  footer: 'h-28 w-auto sm:h-32',
};

const sources = {
  header: '/images/logos/logo-compact-color.png',
  footer: '/images/logos/logo-white.png',
};

const alts = {
  header: 'Flor Alecrim',
  footer: 'Flor Alecrim. Sabores especiais com carinho.',
};

export default function BrandLogo({ variant = 'header' }: BrandLogoProps) {
  return (
    <Photo
      src={sources[variant]}
      alt={alts[variant]}
      sizes={variant === 'header' ? '120px' : '180px'}
      loading="eager"
      fetchPriority="low"
      className={`${sizes[variant]} shrink-0 object-contain`}
    />
  );
}
