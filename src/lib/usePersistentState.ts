import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readStored, removeStored, writeStored } from './storage';

type Options<T> = {
  /** Desliga a persistência (estado só em memória). */
  enabled?: boolean;
  /** Corrige ou rejeita o valor lido (retorne null para descartar). */
  validate?: (value: unknown) => T | null;
  area?: 'local' | 'session';
};

/**
 * useState que sobrevive ao recarregamento da página.
 * O valor lido é sempre validado: o catálogo pode ter mudado desde a última visita.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  { enabled = true, validate, area = 'local' }: Options<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (!enabled) return initial;
    const stored = readStored<unknown>(key, area);
    if (stored === null) return initial;
    if (!validate) return stored as T;
    return validate(stored) ?? initial;
  });

  useEffect(() => {
    if (enabled) writeStored(key, value, area);
  }, [key, value, enabled, area]);

  return [value, setValue];
}

export function clearPersistent(key: string, area: 'local' | 'session' = 'local') {
  removeStored(key, area);
}
