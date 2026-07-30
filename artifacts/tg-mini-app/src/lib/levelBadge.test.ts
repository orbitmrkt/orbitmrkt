import { describe, it, expect } from 'vitest';
import { levelBadge } from './levelBadge';

describe('levelBadge', () => {
  it('1..9 — точный эмодзи без дорисовки', () => {
    expect(levelBadge(1)).toEqual({ key: 'lvl1', draw: null });
    expect(levelBadge(7)).toEqual({ key: 'lvl7', draw: null });
    expect(levelBadge(9)).toEqual({ key: 'lvl9', draw: null });
  });
  it('десятки: форма {tens}0 + дорисованное число', () => {
    expect(levelBadge(10)).toEqual({ key: 'lvl10', draw: '10' });
    expect(levelBadge(11)).toEqual({ key: 'lvl10', draw: '11' });
    expect(levelBadge(19)).toEqual({ key: 'lvl10', draw: '19' });
    expect(levelBadge(47)).toEqual({ key: 'lvl40', draw: '47' });
    expect(levelBadge(90)).toEqual({ key: 'lvl90', draw: '90' });
    expect(levelBadge(99)).toEqual({ key: 'lvl90', draw: '99' });
  });
  it('100+ клампится к lvl90, число полное', () => {
    expect(levelBadge(100)).toEqual({ key: 'lvl90', draw: '100' });
    expect(levelBadge(250)).toEqual({ key: 'lvl90', draw: '250' });
  });
  it('дробный уровень — округляется вниз', () => {
    expect(levelBadge(7.9)).toEqual({ key: 'lvl7', draw: null });
    expect(levelBadge(11.4)).toEqual({ key: 'lvl10', draw: '11' });
  });
  it('невалидный/нулевой уровень — null', () => {
    expect(levelBadge(0)).toBeNull();
    expect(levelBadge(-3)).toBeNull();
    expect(levelBadge(NaN)).toBeNull();
    expect(levelBadge(Infinity)).toBeNull();
  });
});
