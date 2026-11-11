import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';
import { buildOrderMessage, buildWhatsAppLink } from '../data/brand';
import { menuLine } from '../data/offers';

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
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addLine = useCallback((key: string, quantity?: number) => {
    setOrderItems((prev) => (prev.includes(key) ? prev : [...prev, key]));
    const line = menuLine(key);
    if (!line) return;
    setQuantities((prev) => ({
      ...prev,
      [key]: quantity ?? prev[key] ?? line.min,
    }));
  }, []);

  const addToOrder = useCallback((product: Product, quantity?: number) => {
    addLine(product.id, quantity);
  }, [addLine]);

  const setItemQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
  }, []);

  const getQuantity = useCallback(
    (productId: string) => quantities[productId],
    [quantities]
  );

  const removeFromOrder = useCallback((productId: string) => {
    setOrderItems((prev) => prev.filter((id) => id !== productId));
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clearOrder = useCallback(() => {
    setOrderItems([]);
    setQuantities({});
  }, []);

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
        const quantity = quantities[id];
        return quantity ? `${line.name} — ${quantity} un.` : line.name;
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
