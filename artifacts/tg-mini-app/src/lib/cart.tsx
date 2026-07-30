import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Gift } from './mockGifts';
import { addItem, removeItem, toggleItem, cartTotal } from './cartMath';
import { CART_STORAGE_KEY, parseStoredCart, serializeCart } from './cartStorage';

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

interface TgCloudStorage {
  getItem(
    key: string,
    callback: (error: string | null, value: string | null) => void,
  ): void;
  setItem(
    key: string,
    value: string,
    callback?: (error: string | null, stored: boolean) => void,
  ): void;
}

function getCloudStorage(): TgCloudStorage | null {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp?.CloudStorage ?? null;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Gift[]>([]);
  // Пока не загрузились из облака — не сохраняем, чтобы пустой старт не затёр данные.
  const hydrated = useRef(false);

  // Загрузка корзины из Telegram CloudStorage при старте.
  useEffect(() => {
    const cs = getCloudStorage();
    if (!cs) {
      hydrated.current = true;
      return;
    }
    cs.getItem(CART_STORAGE_KEY, (error, value) => {
      if (!error && value) setItems(parseStoredCart(value));
      hydrated.current = true;
    });
  }, []);

  // Сохранение при изменениях — только после гидрации.
  useEffect(() => {
    if (!hydrated.current) return;
    const cs = getCloudStorage();
    if (!cs) return;
    try {
      cs.setItem(CART_STORAGE_KEY, serializeCart(items));
    } catch {
      /* лимит CloudStorage / отказ — игнорируем */
    }
  }, [items]);

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
