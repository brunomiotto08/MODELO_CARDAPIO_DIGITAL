import { siteConfig } from '../config/site.config';

/**
 * Acesso seguro ao localStorage/sessionStorage: navegação anônima, cota cheia
 * ou armazenamento bloqueado nunca quebram a página (só não salvam).
 * Chaves são versionadas: mude a versão quando o formato salvo mudar.
 */

type Area = 'local' | 'session';

function area(kind: Area): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function storageKey(name: string, version = 1): string {
  return `${siteConfig.site.storageKey}:${name}:v${version}`;
}

export function readStored<T>(key: string, kind: Area = 'local'): T | null {
  try {
    const raw = area(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: unknown, kind: Area = 'local'): void {
  try {
    area(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* sem armazenamento disponível: segue só em memória */
  }
}

export function removeStored(key: string, kind: Area = 'local'): void {
  try {
    area(kind)?.removeItem(key);
  } catch {
    /* idem */
  }
}
