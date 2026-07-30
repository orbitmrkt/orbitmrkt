import { describe, it, expect } from 'vitest';
import { parseStoredCart, serializeCart } from './cartStorage';
import type { Gift } from './mockGifts';

function g(id: string, price = 1): Gift {
  return {
    id,
    collection: 'Col',
    name: 'Name',
    number: 7,
    image: 'https://x/y.jpg',
    price,
    accent: '#000',
  };
}

describe('parseStoredCart', () => {
  it('null → []', () => {
    expect(parseStoredCart(null)).toEqual([]);
  });
  it('undefined → []', () => {
    expect(parseStoredCart(undefined)).toEqual([]);
  });
  it('пустая строка → []', () => {
    expect(parseStoredCart('')).toEqual([]);
  });
  it('битый JSON → []', () => {
    expect(parseStoredCart('{не json')).toEqual([]);
  });
  it('не массив (объект) → []', () => {
    expect(parseStoredCart('{"a":1}')).toEqual([]);
  });
  it('не массив (число) → []', () => {
    expect(parseStoredCart('42')).toEqual([]);
  });
  it('валидный массив → элементы', () => {
    const items = [g('a'), g('b')];
    expect(parseStoredCart(serializeCart(items))).toEqual(items);
  });
  it('отсеивает кривые записи', () => {
    const raw = JSON.stringify([
      g('ok'),
      { id: 'x' },
      null,
      5,
      { ...g('bad'), price: 'нет' },
    ]);
    const res = parseStoredCart(raw);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('ok');
  });
});

describe('serializeCart', () => {
  it('round-trip', () => {
    const items = [g('a', 10.5), g('b', 0.1)];
    expect(parseStoredCart(serializeCart(items))).toEqual(items);
  });
  it('пустая корзина → "[]"', () => {
    expect(serializeCart([])).toBe('[]');
  });
});
