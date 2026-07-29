import { describe, it, expect } from 'vitest';
import { resolveColorScheme } from './theme';

describe('resolveColorScheme', () => {
  it('вне Telegram (inTg = false), система светлая → light', () => {
    expect(resolveColorScheme(null, false, false)).toBe('light');
  });
  it('вне Telegram (inTg = false), система тёмная → dark', () => {
    expect(resolveColorScheme({ colorScheme: 'light' }, true, false)).toBe('dark');
  });
  it('внутри Telegram, tg.colorScheme dark → dark', () => {
    expect(resolveColorScheme({ colorScheme: 'dark' }, false, true)).toBe('dark');
  });
  it('внутри Telegram, tg.colorScheme light → light (даже если система тёмная)', () => {
    expect(resolveColorScheme({ colorScheme: 'light' }, true, true)).toBe('light');
  });
  it('битый colorScheme внутри Telegram → фолбэк на систему (dark)', () => {
    expect(resolveColorScheme({ colorScheme: 'blahblah' }, true, true)).toBe('dark');
  });
  it('undefined colorScheme → фолбэк (light)', () => {
    expect(resolveColorScheme({}, false, true)).toBe('light');
  });
  it('colorScheme число → фолбэк на систему', () => {
    expect(resolveColorScheme({ colorScheme: 1 } as never, true, true)).toBe('dark');
  });
  it('prefersDark по умолчанию false → light', () => {
    expect(resolveColorScheme(null)).toBe('light');
  });
});
