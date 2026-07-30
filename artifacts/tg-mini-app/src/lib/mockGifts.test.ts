import { describe, it, expect } from 'vitest';
import { randomGifts } from './mockGifts';

describe('randomGifts', () => {
  it('возвращает запрошенное количество (в т.ч. 0)', () => {
    expect(randomGifts(24)).toHaveLength(24);
    expect(randomGifts(0)).toHaveLength(0);
    expect(randomGifts(1)).toHaveLength(1);
  });

  it('у всех карточек валидные поля', () => {
    for (const g of randomGifts(60)) {
      expect(g.name).toBeTruthy();
      expect(g.collection).toBeTruthy();
      expect(g.number).toBeGreaterThan(0);
      expect(g.image).toMatch(
        /^https:\/\/nft\.fragment\.com\/gift\/.+-\d+\.medium\.jpg$/,
      );
      expect(g.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('цена в диапазоне [0.5, 250] и не более 1 знака после точки', () => {
    for (const g of randomGifts(200)) {
      expect(g.price).toBeGreaterThanOrEqual(0.5);
      expect(g.price).toBeLessThanOrEqual(250);
      // price*10 должно быть целым (макс 1 знак после точки)
      expect(Number.isInteger(Math.round(g.price * 10))).toBe(true);
      expect(Math.abs(g.price * 10 - Math.round(g.price * 10))).toBeLessThan(1e-9);
    }
  });

  it('id уникальны в пределах одного вызова', () => {
    const ids = randomGifts(50).map((g) => g.id);
    expect(new Set(ids).size).toBe(50);
  });

  it('image собирается из collection и number', () => {
    for (const g of randomGifts(30)) {
      expect(g.image).toContain(`/gift/${g.collection}-${g.number}.medium.jpg`);
    }
  });
});
