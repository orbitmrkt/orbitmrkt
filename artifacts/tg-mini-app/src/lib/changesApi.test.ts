import { describe, it, expect } from 'vitest';
import {
  modelLottieUrl,
  symbolPngUrl,
  backdropsUrl,
  findBackdrop,
} from './changesApi';

describe('changesApi url builders', () => {
  it('model lottie url + энкодинг имени', () => {
    expect(modelLottieUrl('PlushPepe', 'Pumpkin')).toBe(
      'https://api.changes.tg/model/PlushPepe/Pumpkin.json',
    );
    expect(modelLottieUrl('Durov', 'Red Fur Coat')).toBe(
      'https://api.changes.tg/model/Durov/Red%20Fur%20Coat.json',
    );
  });
  it('symbol png url с размером', () => {
    expect(symbolPngUrl('PlushPepe', 'Ink Pen')).toBe(
      'https://api.changes.tg/symbol/PlushPepe/Ink%20Pen.png?size=128',
    );
    expect(symbolPngUrl('PlushPepe', 'X', 256)).toContain('size=256');
  });
  it('backdrops url', () => {
    expect(backdropsUrl('PlushPepe')).toBe('https://api.changes.tg/backdrops/PlushPepe');
  });
});

describe('findBackdrop', () => {
  const list = [
    { name: 'English Violet', hex: { centerColor: '#b186bb', edgeColor: '#875a91', patternColor: '#54225f', textColor: '#e6c7ed' } },
    { name: 'Onyx Black', hex: { centerColor: '#111', edgeColor: '#000', patternColor: '#333', textColor: '#eee' } },
  ];
  it('находит по имени (регистронезависимо)', () => {
    expect(findBackdrop(list, 'onyx black')?.centerColor).toBe('#111');
  });
  it('нет совпадения → null', () => {
    expect(findBackdrop(list, 'Neon Blue')).toBeNull();
  });
  it('не массив → null', () => {
    expect(findBackdrop(undefined as never, 'x')).toBeNull();
  });
});
