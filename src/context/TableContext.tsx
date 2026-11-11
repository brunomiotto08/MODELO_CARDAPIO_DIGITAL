import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { menuLine } from '../data/offers';
import { buildTableMessage, buildWhatsAppLink } from '../data/brand';

type TableContextValue = {
  plateIds: string[];
  sweets: boolean;
  flowers: boolean;
  togglePlate: (productId: string) => void;
  placeLine: (key: string, quantity: number) => void;
  removePlate: (productId: string) => void;
  applyPlates: (productIds: string[]) => void;
  hasPlate: (productId: string) => boolean;
  getQuantity: (productId: string) => number | undefined;
  setPlateQuantity: (productId: string, quantity: number) => void;
  setSweets: (value: boolean) => void;
  setFlowers: (value: boolean) => void;
  count: number;
  whatsappLink: string | null;
};

function minimumQuantity(productId: string): number {
  return menuLine(productId)?.min ?? 1;
}

const TableContext = createContext<TableContextValue | null>(null);

export function TableProvider({ children }: { children: ReactNode }) {
  const [plateIds, setPlateIds] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sweets, setSweets] = useState(false);
  const [flowers, setFlowers] = useState(false);

  const rememberQuantity = useCallback((current: Record<string, number>, productId: string) => {
    return current[productId] ?? minimumQuantity(productId);
  }, []);

  const togglePlate = useCallback((productId: string) => {
    setPlateIds((current) => {
      if (current.includes(productId)) {
        setQuantities((saved) => {
          const next = { ...saved };
          delete next[productId];
          return next;
        });
        return current.filter((id) => id !== productId);
      }
      setQuantities((saved) => ({ ...saved, [productId]: rememberQuantity(saved, productId) }));
      return [...current, productId];
    });
  }, [rememberQuantity]);

  const placeLine = useCallback((key: string, quantity: number) => {
    setPlateIds((current) => (current.includes(key) ? current : [...current, key]));
    setQuantities((saved) => ({ ...saved, [key]: quantity }));
  }, []);

  const removePlate = useCallback((productId: string) => {
    setPlateIds((current) => current.filter((id) => id !== productId));
    setQuantities((saved) => {
      const next = { ...saved };
      delete next[productId];
      return next;
    });
  }, []);

  const applyPlates = useCallback((productIds: string[]) => {
    const unique = [...new Set(productIds)];
    setPlateIds(unique);
    setQuantities((saved) => {
      const next: Record<string, number> = {};
      for (const id of unique) next[id] = saved[id] ?? minimumQuantity(id);
      return next;
    });
  }, []);

  const setPlateQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((saved) => ({ ...saved, [productId]: quantity }));
  }, []);

  const getQuantity = useCallback(
    (productId: string) => quantities[productId],
    [quantities],
  );

  const hasPlate = useCallback(
    (productId: string) => plateIds.includes(productId),
    [plateIds],
  );

  const whatsappLink = useMemo(() => {
    const lines = plateIds
      .map((id) => {
        const line = menuLine(id);
        if (!line) return null;
        const quantity = quantities[id] ?? line.min;
        return `${line.name} — ${quantity} un.`;
      })
      .filter((line): line is string => Boolean(line));
    const extras = [
      sweets ? 'doces' : '',
      flowers ? 'arranjo floral' : '',
    ].filter(Boolean);
    return buildWhatsAppLink(buildTableMessage(lines, extras));
  }, [plateIds, quantities, sweets, flowers]);

  const value = useMemo(
    () => ({
      plateIds,
      sweets,
      flowers,
      togglePlate,
      placeLine,
      removePlate,
      applyPlates,
      hasPlate,
      getQuantity,
      setPlateQuantity,
      setSweets,
      setFlowers,
      count: plateIds.length,
      whatsappLink,
    }),
    [plateIds, sweets, flowers, togglePlate, placeLine, removePlate, applyPlates, hasPlate, getQuantity, setPlateQuantity, whatsappLink],
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTable must be used within TableProvider');
  return context;
}
