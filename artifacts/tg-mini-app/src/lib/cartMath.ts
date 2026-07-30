import type { Gift } from './mockGifts';

/** Сумма цен товаров в корзине, округлённая до 2 знаков (без float-хвостов). */
export function cartTotal(items: Gift[]): number {
  const sum = items.reduce((acc, g) => acc + g.price, 0);
  return Math.round(sum * 100) / 100;
}

/** Форматирует сумму GRAM как строку с двумя знаками после точки. */
export function formatGram(total: number): string {
  return total.toFixed(2);
}

/** Русское склонение слова «подарок» под число n. */
export function pluralizeGifts(n: number): string {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return 'подарков';
  if (d === 1) return 'подарок';
  if (d >= 2 && d <= 4) return 'подарка';
  return 'подарков';
}

/** Добавляет товар, если его ещё нет (без дублей по id). Иначе возвращает тот же массив. */
export function addItem(items: Gift[], gift: Gift): Gift[] {
  if (items.some((g) => g.id === gift.id)) return items;
  return [...items, gift];
}

/** Удаляет товар по id (если нет — массив без изменений). */
export function removeItem(items: Gift[], id: string): Gift[] {
  return items.filter((g) => g.id !== id);
}

/** Переключает наличие товара: добавляет, если нет; убирает, если есть. */
export function toggleItem(items: Gift[], gift: Gift): Gift[] {
  return items.some((g) => g.id === gift.id)
    ? removeItem(items, gift.id)
    : addItem(items, gift);
}
