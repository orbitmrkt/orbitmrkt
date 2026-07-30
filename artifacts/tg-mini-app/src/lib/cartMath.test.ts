import { describe, it, expect } from 'vitest';
import {
  cartTotal,
  formatGram,
  pluralizeGifts,
  addItem,
  removeItem,
  toggleItem,
  selectedItems,
  selectedTotal,
  isAllSelected,
} from './cartMath';
import type { Gift } from './mockGifts';

function g(id: string, price: number): Gift {
  return { id, collection: 'C', name: 'N', number: 1, image: 'i', price, accent: '#000' };
}

describe('cartTotal', () => {
  it('пустая корзина = 0', () => {
    expect(cartTotal([])).toBe(0);
  });
  it('суммирует цены', () => {
    expect(cartTotal([g('a', 10), g('b', 5.5)])).toBe(15.5);
  });
  it('без float-хвостов (0.1 + 0.2)', () => {
    expect(cartTotal([g('a', 0.1), g('b', 0.2)])).toBe(0.3);
  });
});

describe('formatGram', () => {
  it('два знака после точки', () => {
    expect(formatGram(434.7)).toBe('434.70');
  });
  it('ноль', () => {
    expect(formatGram(0)).toBe('0.00');
  });
});

describe('pluralizeGifts', () => {
  it.each([
    [1, 'подарок'],
    [2, 'подарка'],
    [3, 'подарка'],
    [4, 'подарка'],
    [5, 'подарков'],
    [0, 'подарков'],
    [11, 'подарков'],
    [12, 'подарков'],
    [13, 'подарков'],
    [14, 'подарков'],
    [21, 'подарок'],
    [22, 'подарка'],
    [25, 'подарков'],
    [101, 'подарок'],
    [111, 'подарков'],
    [114, 'подарков'],
  ])('%i → %s', (n, word) => {
    expect(pluralizeGifts(n as number)).toBe(word);
  });
});

describe('addItem', () => {
  it('добавляет новый', () => {
    expect(addItem([], g('a', 1))).toHaveLength(1);
  });
  it('не дублирует по id (возвращает тот же массив)', () => {
    const items = [g('a', 1)];
    expect(addItem(items, g('a', 2))).toBe(items);
  });
});

describe('removeItem', () => {
  it('удаляет по id', () => {
    expect(removeItem([g('a', 1), g('b', 2)], 'a')).toHaveLength(1);
  });
  it('несуществующий id — без изменений', () => {
    expect(removeItem([g('a', 1)], 'x')).toHaveLength(1);
  });
});

describe('toggleItem', () => {
  it('добавляет, если нет', () => {
    expect(toggleItem([], g('a', 1))).toHaveLength(1);
  });
  it('убирает, если есть', () => {
    expect(toggleItem([g('a', 1)], g('a', 1))).toHaveLength(0);
  });
});

describe('выбор товаров', () => {
  const its = [g('a', 10), g('b', 5), g('c', 2.5)];

  it('ничего не снято → выбраны все', () => {
    expect(selectedItems(its, new Set())).toHaveLength(3);
    expect(selectedTotal(its, new Set())).toBe(17.5);
    expect(isAllSelected(its, new Set())).toBe(true);
  });
  it('часть снята', () => {
    const d = new Set(['b']);
    expect(selectedItems(its, d)).toHaveLength(2);
    expect(selectedTotal(its, d)).toBe(12.5);
    expect(isAllSelected(its, d)).toBe(false);
  });
  it('сняты все → сумма 0, isAllSelected false', () => {
    const d = new Set(['a', 'b', 'c']);
    expect(selectedTotal(its, d)).toBe(0);
    expect(isAllSelected(its, d)).toBe(false);
  });
  it('пустая корзина → isAllSelected false', () => {
    expect(isAllSelected([], new Set())).toBe(false);
  });
  it('лишний id в deselected не ломает сумму', () => {
    expect(selectedTotal(its, new Set(['zzz']))).toBe(17.5);
  });
});
