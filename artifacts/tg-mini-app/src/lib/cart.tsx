import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Gift } from './mockGifts';
import { addItem, removeItem, toggleItem, cartTotal } from './cartMath';

interface CartValue {
  items: Gift[];
  count: number;
  total: number;
  has: (id: string) => boolean;
  add: (gift: Gift) => void;
  remove: (id: string) => void;
  toggle: (gift: Gift) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Gift[]>([]);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.length,
      total: cartTotal(items),
      has: (id) => items.some((g) => g.id === id),
      add: (gift) => setItems((prev) => addItem(prev, gift)),
      remove: (id) => setItems((prev) => removeItem(prev, id)),
      toggle: (gift) => setItems((prev) => toggleItem(prev, gift)),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
