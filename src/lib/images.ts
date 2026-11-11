import manifestJson from '../data/image-manifest.json';

const manifest = manifestJson as Record<string, number[]>;

export function imageAttrs(src: string, sizes = '(min-width: 1024px) 40vw, 100vw') {
  const widths = manifest[src];
  if (!widths?.length) return { src };

  const base = src.replace(/^\/images\//, '').replace(/\.[^.]+$/, '');
  const srcSet = widths
    .map((width) => `/images/opt/${base}-${width}.webp ${width}w`)
    .join(', ');
  const fallback = widths.find((width) => width >= 960) ?? widths[widths.length - 1];

  return {
    src: `/images/opt/${base}-${fallback}.webp`,
    srcSet,
    sizes,
  };
}
