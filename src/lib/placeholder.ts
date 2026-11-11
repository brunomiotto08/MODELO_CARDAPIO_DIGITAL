import type { SyntheticEvent } from 'react';

export const PLACEHOLDER_SRC = '/images/placeholder/placeholder.svg';

/** Troca uma imagem que não carregou pelo ícone de imagem. */
export function onImageError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.removeAttribute('srcset');
  img.src = PLACEHOLDER_SRC;
}
