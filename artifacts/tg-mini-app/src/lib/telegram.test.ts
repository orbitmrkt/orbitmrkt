import { describe, it, expect } from 'vitest';
import { isInTelegram } from './telegram';

const w = (webApp: unknown) =>
  ({
    Telegram: webApp === undefined ? undefined : { WebApp: webApp },
  }) as never;

describe('isInTelegram', () => {
  it('нет window → false', () => {
    expect(isInTelegram(undefined)).toBe(false);
  });
  it('нет Telegram.WebApp → false', () => {
    expect(isInTelegram(w(undefined))).toBe(false);
  });
  it('пустой WebApp (браузер) → false', () => {
    expect(isInTelegram(w({}))).toBe(false);
  });
  it("platform 'unknown' + пустой initData → false", () => {
    expect(isInTelegram(w({ platform: 'unknown', initData: '' }))).toBe(false);
  });
  it('пустая строка platform → false', () => {
    expect(isInTelegram(w({ platform: '' }))).toBe(false);
  });
  it("platform 'ios' → true", () => {
    expect(isInTelegram(w({ platform: 'ios' }))).toBe(true);
  });
  it("platform 'android' → true", () => {
    expect(isInTelegram(w({ platform: 'android' }))).toBe(true);
  });
  it("platform 'tdesktop' → true", () => {
    expect(isInTelegram(w({ platform: 'tdesktop' }))).toBe(true);
  });
  it("platform 'unknown', но есть initData → true", () => {
    expect(
      isInTelegram(w({ platform: 'unknown', initData: 'query_id=AAA' })),
    ).toBe(true);
  });
  it('есть initDataUnsafe.user → true', () => {
    expect(
      isInTelegram(
        w({ platform: 'unknown', initDataUnsafe: { user: { id: 1 } } }),
      ),
    ).toBe(true);
  });
  it('битый platform (число) без initData → false', () => {
    expect(isInTelegram(w({ platform: 123 }))).toBe(false);
  });
  it('битый platform (число) + initData → true', () => {
    expect(isInTelegram(w({ platform: 123, initData: 'x=1' }))).toBe(true);
  });
});
