import type { Gift } from './mockGifts';

/** Ключ Telegram CloudStorage (допустимы символы A-Za-z0-9_-, до 128 симв.). */
export const CART_STORAGE_KEY = 'orbit_cart_v1';

function isValidGift(x: unknown): x is Gift {
  if (typeof x !== 'object' || x === null) return false;
  const g = x as Record<string, unknown>;
  return (
    typeof g.id === 'string' &&
    typeof g.collection === 'string' &&
    typeof g.name === 'string' &&
    typeof g.number === 'number' &&
    typeof g.image === 'string' &&
    typeof g.price === 'number' &&
    typeof g.accent === 'string'
  );
}

/**
 * Разбирает сохранённую корзину. Устойчиво к null/undefined/пустой строке/
 * битому JSON/не-массиву — во всех этих случаях возвращает пустой массив.
 * Кривые записи внутри массива отсеиваются.
 */
export function parseStoredCart(raw: string | null | undefined): Gift[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(isValidGift);
  } catch {
    return [];
  }
}

/** Сериализует корзину в строку для хранилища. */
export function serializeCart(items: Gift[]): string {
  return JSON.stringify(items);
}
