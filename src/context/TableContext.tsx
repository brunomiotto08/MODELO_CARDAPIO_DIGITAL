import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { menuLine } from '../data/offers';
import { buildTableMessage, buildWhatsAppLink, itemLine } from '../data/brand';
import { isEnabled } from '../config/features';
import { siteConfig } from '../config/site.config';
import { storageKey } from '../lib/storage';
import { usePersistentState } from '../lib/usePersistentState';
import { decodeTable, encodeTable, shareTableUrl, type SharedTable } from '../lib/shareTable';

type TableContextValue = {
  plateIds: string[];
  sweets: boolean;
  flowers: boolean;
  togglePlate: (productId: string) => void;
  placeLine: (key: string, quantity: number) => void;
  removePlate: (productId: string) => void;
  /** Substitui a mesa. Quantidades opcionais por chave (senão mantém as salvas ou usa o mínimo). */
  applyPlates: (productIds: string[], quantities?: Record<string, number>) => void;
  /** Substitui a mesa inteira, incluindo doces e arranjo (mesa compartilhada). */
  loadTable: (table: SharedTable) => void;
  hasPlate: (productId: string) => boolean;
  getQuantity: (productId: string) => number | undefined;
  setPlateQuantity: (productId: string, quantity: number) => void;
  setSweets: (value: boolean) => void;
  setFlowers: (value: boolean) => void;
  count: number;
  whatsappLink: string | null;
  /** Link que reabre esta mesa; null com a feature desligada ou mesa vazia. */
  shareUrl: string | null;
};

const emptyTable: SharedTable = { plateIds: [], quantities: {}, sweets: false, flowers: false };

function minimumQuantity(productId: string): number {
  return menuLine(productId)?.min ?? 1;
}

function clampQuantity(key: string, quantity: number): number {
  const line = menuLine(key);
  if (!line) return quantity;
  return Math.min(line.max, Math.max(line.min, Math.round(quantity)));
}

/** Revalida a mesa salva contra o cardápio atual. */
function validateStored(value: unknown): SharedTable | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Partial<SharedTable>;
  if (!Array.isArray(raw.plateIds)) return null;
  return (
    decodeTable(
      encodeTable({
        plateIds: raw.plateIds.filter((id): id is string => typeof id === 'string'),
        quantities: raw.quantities && typeof raw.quantities === 'object' ? raw.quantities : {},
        sweets: Boolean(raw.sweets),
        flowers: Boolean(raw.flowers),
      }),
    ) ?? emptyTable
  );
}

const TableContext = createContext<TableContextValue | null>(null);

function siteOrigin(): string {
  return typeof window !== 'undefined' ? window.location.origin : siteConfig.site.url;
}

export function TableProvider({ children }: { children: ReactNode }) {
  const [table, setTable] = usePersistentState<SharedTable>(storageKey('table'), emptyTable, {
    enabled: isEnabled('persistence'),
    validate: validateStored,
  });
  const { plateIds, quantities, sweets, flowers } = table;

  const togglePlate = useCallback((productId: string) => {
    setTable((current) => {
      if (current.plateIds.includes(productId)) {
        const nextQuantities = { ...current.quantities };
        delete nextQuantities[productId];
        return {
          ...current,
          plateIds: current.plateIds.filter((id) => id !== productId),
          quantities: nextQuantities,
        };
      }
      return {
        ...current,
        plateIds: [...current.plateIds, productId],
        quantities: {
          ...current.quantities,
          [productId]: current.quantities[productId] ?? minimumQuantity(productId),
        },
      };
    });
  }, [setTable]);

  const placeLine = useCallback((key: string, quantity: number) => {
    setTable((current) => ({
      ...current,
      plateIds: current.plateIds.includes(key) ? current.plateIds : [...current.plateIds, key],
      quantities: { ...current.quantities, [key]: quantity },
    }));
  }, [setTable]);

  const removePlate = useCallback((productId: string) => {
    setTable((current) => {
      const nextQuantities = { ...current.quantities };
      delete nextQuantities[productId];
      return {
        ...current,
        plateIds: current.plateIds.filter((id) => id !== productId),
        quantities: nextQuantities,
      };
    });
  }, [setTable]);

  const applyPlates = useCallback((productIds: string[], given?: Record<string, number>) => {
    const unique = [...new Set(productIds)];
    setTable((current) => {
      const next: Record<string, number> = {};
      for (const id of unique) {
        const wanted = given?.[id];
        next[id] = wanted !== undefined
          ? clampQuantity(id, wanted)
          : current.quantities[id] ?? minimumQuantity(id);
      }
      return { ...current, plateIds: unique, quantities: next };
    });
  }, [setTable]);

  const loadTable = useCallback((shared: SharedTable) => {
    setTable({
      plateIds: [...shared.plateIds],
      quantities: { ...shared.quantities },
      sweets: shared.sweets,
      flowers: shared.flowers,
    });
  }, [setTable]);

  const setPlateQuantity = useCallback((productId: string, quantity: number) => {
    setTable((current) => ({ ...current, quantities: { ...current.quantities, [productId]: quantity } }));
  }, [setTable]);

  const setSweets = useCallback((value: boolean) => {
    setTable((current) => ({ ...current, sweets: value }));
  }, [setTable]);

  const setFlowers = useCallback((value: boolean) => {
    setTable((current) => ({ ...current, flowers: value }));
  }, [setTable]);

  const getQuantity = useCallback(
    (productId: string) => quantities[productId],
    [quantities],
  );

  const hasPlate = useCallback(
    (productId: string) => plateIds.includes(productId),
    [plateIds],
  );

  const shareUrl = useMemo(() => {
    if (!isEnabled('shareTable')) return null;
    if (plateIds.length === 0 && !sweets && !flowers) return null;
    return shareTableUrl(table, siteOrigin());
  }, [table, plateIds.length, sweets, flowers]);

  const whatsappLink = useMemo(() => {
    const lines = plateIds
      .map((id) => {
        const line = menuLine(id);
        if (!line) return null;
        return itemLine(line.name, quantities[id] ?? line.min);
      })
      .filter((line): line is string => Boolean(line));
    const extras = [
      sweets ? 'doces' : '',
      flowers ? 'arranjo floral' : '',
    ].filter(Boolean);
    return buildWhatsAppLink(buildTableMessage(lines, extras, plateIds.length > 0 ? shareUrl : null));
  }, [plateIds, quantities, sweets, flowers, shareUrl]);

  const value = useMemo(
    () => ({
      plateIds,
      sweets,
      flowers,
      togglePlate,
      placeLine,
      removePlate,
      applyPlates,
      loadTable,
      hasPlate,
      getQuantity,
      setPlateQuantity,
      setSweets,
      setFlowers,
      count: plateIds.length,
      whatsappLink,
      shareUrl,
    }),
    [plateIds, sweets, flowers, togglePlate, placeLine, removePlate, applyPlates, loadTable, hasPlate, getQuantity, setPlateQuantity, setSweets, setFlowers, whatsappLink, shareUrl],
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTable must be used within TableProvider');
  return context;
}
