import { describe, it, expect } from 'vitest';
import { resolveColorScheme } from './theme';

describe('resolveColorScheme', () => {
  it('нет tg, система светлая → light', () => {
    expect(resolveColorScheme(null, false)).toBe('light');
  });
  it('нет tg, система тёмная → dark', () => {
    expect(resolveColorScheme(undefined, true)).toBe('dark');
  });
  it("tg.colorScheme 'dark' → dark", () => {
    expect(resolveColorScheme({ colorScheme: 'dark' }, false)).toBe('dark');
  });
  it("tg.colorScheme 'light' → light (даже если система тёмная)", () => {
    expect(resolveColorScheme({ colorScheme: 'light' }, true)).toBe('light');
  });
  it('битый colorScheme (строка) → фолбэк на систему (dark)', () => {
    expect(resolveColorScheme({ colorScheme: 'blahblah' }, true)).toBe('dark');
  });
  it('undefined colorScheme → фолбэк (light)', () => {
    expect(resolveColorScheme({}, false)).toBe('light');
  });
  it('colorScheme число → фолбэк на систему', () => {
    expect(resolveColorScheme({ colorScheme: 1 } as never, true)).toBe('dark');
  });
  it('prefersDark по умолчанию false → light', () => {
    expect(resolveColorScheme(null)).toBe('light');
  });
});
