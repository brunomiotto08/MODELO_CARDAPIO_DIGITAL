import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';
import { buildOrderMessage, buildWhatsAppLink, itemLine } from '../data/brand';
import { menuLine } from '../data/offers';
import { isEnabled } from '../config/features';
import { storageKey } from '../lib/storage';
import { usePersistentState } from '../lib/usePersistentState';

type StoredOrder = { orderItems: string[]; quantities: Record<string, number> };

const emptyOrder: StoredOrder = { orderItems: [], quantities: {} };

/** Revalida a lista salva: descarta itens que saíram do cardápio e reajusta quantidades. */
function validateStored(value: unknown): StoredOrder | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Partial<StoredOrder>;
  if (!Array.isArray(raw.orderItems)) return null;
  const orderItems: string[] = [];
  const quantities: Record<string, number> = {};
  for (const key of raw.orderItems) {
    const line = typeof key === 'string' ? menuLine(key) : null;
    if (!line || orderItems.includes(line.key)) continue;
    orderItems.push(line.key);
    const saved = Number(raw.quantities?.[line.key]);
    quantities[line.key] = Number.isFinite(saved)
      ? Math.min(line.max, Math.max(line.min, Math.round(saved)))
      : line.min;
  }
  return { orderItems, quantities };
}

interface OrderContextValue {
  orderItems: string[];
  addToOrder: (product: Product, quantity?: number) => void;
  addLine: (key: string, quantity?: number) => void;
  setItemQuantity: (productId: string, quantity: number) => void;
  getQuantity: (productId: string) => number | undefined;
  removeFromOrder: (productId: string) => void;
  clearOrder: () => void;
  isInOrder: (productId: string) => boolean;
  orderCount: number;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  getWhatsAppLink: () => string | null;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = usePersistentState<StoredOrder>(storageKey('order'), emptyOrder, {
    enabled: isEnabled('persistence'),
    validate: validateStored,
  });
  const { orderItems, quantities } = order;
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addLine = useCallback((key: string, quantity?: number) => {
    const line = menuLine(key);
    setOrder((prev) => ({
      orderItems: prev.orderItems.includes(key) ? prev.orderItems : [...prev.orderItems, key],
      quantities: line
        ? { ...prev.quantities, [key]: quantity ?? prev.quantities[key] ?? line.min }
        : prev.quantities,
    }));
  }, [setOrder]);

  const addToOrder = useCallback((product: Product, quantity?: number) => {
    addLine(product.id, quantity);
  }, [addLine]);

  const setItemQuantity = useCallback((productId: string, quantity: number) => {
    setOrder((prev) => ({ ...prev, quantities: { ...prev.quantities, [productId]: quantity } }));
  }, [setOrder]);

  const getQuantity = useCallback(
    (productId: string) => quantities[productId],
    [quantities]
  );

  const removeFromOrder = useCallback((productId: string) => {
    setOrder((prev) => {
      const next = { ...prev.quantities };
      delete next[productId];
      return { orderItems: prev.orderItems.filter((id) => id !== productId), quantities: next };
    });
  }, [setOrder]);

  const clearOrder = useCallback(() => {
    setOrder(emptyOrder);
  }, [setOrder]);

  const isInOrder = useCallback(
    (productId: string) => orderItems.includes(productId),
    [orderItems]
  );

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const getWhatsAppLink = useCallback(() => {
    const selectedNames = orderItems
      .map((id) => {
        const line = menuLine(id);
        if (!line) return null;
        return itemLine(line.name, quantities[id]);
      })
      .filter((name): name is string => Boolean(name));
    if (selectedNames.length === 0) return null;
    return buildWhatsAppLink(buildOrderMessage(selectedNames));
  }, [orderItems, quantities]);

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        addToOrder,
        addLine,
        setItemQuantity,
        getQuantity,
        removeFromOrder,
        clearOrder,
        isInOrder,
        orderCount: orderItems.length,
        isPanelOpen,
        openPanel,
        closePanel,
        getWhatsAppLink,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
