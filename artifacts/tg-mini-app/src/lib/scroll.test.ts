import { describe, it, expect } from 'vitest';
import { isHeaderRevealed, HEADER_REVEAL_THRESHOLD } from './scroll';

describe('isHeaderRevealed', () => {
  it('скрыт в самом верху (scrollTop 0)', () => {
    expect(isHeaderRevealed(0)).toBe(false);
  });

  it('скрыт при отрицательном scrollTop (overscroll-баунс)', () => {
    expect(isHeaderRevealed(-40)).toBe(false);
  });

  it('скрыт ровно на пороге', () => {
    expect(isHeaderRevealed(HEADER_REVEAL_THRESHOLD)).toBe(false);
  });

  it('показан сразу за порогом', () => {
    expect(isHeaderRevealed(HEADER_REVEAL_THRESHOLD + 1)).toBe(true);
  });

  it('показан при большой прокрутке', () => {
    expect(isHeaderRevealed(5000)).toBe(true);
  });
});
