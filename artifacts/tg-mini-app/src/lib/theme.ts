import { useEffect } from 'react';
import { isInTelegram } from './telegram';

export type ColorScheme = 'light' | 'dark';

interface TgThemeApp {
  colorScheme?: unknown;
  themeParams?: Record<string, unknown>;
  onEvent?: (event: string, cb: () => void) => void;
  offEvent?: (event: string, cb: () => void) => void;
}

/**
 * Прокидывает цвета Telegram-темы (`themeParams`) в CSS-переменные `--tg-theme-*`
 * на `<html>`, чтобы наши токены `--app-*` могли на них опираться.
 */
function applyThemeParams(tg: TgThemeApp | null): void {
  const params = tg?.themeParams;
  if (!params || typeof params !== 'object') return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== 'string') continue;
    root.style.setProperty(`--tg-theme-${key.replace(/_/g, '-')}`, value);
  }
}

/**
 * Обновляет мета-тег theme-color под текущую тему для шапки браузера/устройства.
 */
function updateMetaThemeColor(scheme: ColorScheme): void {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', scheme === 'dark' ? '#1c2028' : '#ffffff');
}

/**
 * Определяет цветовую схему: вне Telegram — строго по системным настройкам устройства (`prefersDark`).
 * Внутри Telegram — по `tg.colorScheme` с фолбэком на системную тему.
 */
export function resolveColorScheme(
  tg: TgThemeApp | null | undefined,
  prefersDark = false,
  inTg = true,
): ColorScheme {
  if (!inTg) return prefersDark ? 'dark' : 'light';
  const cs =
    tg && typeof tg === 'object' ? (tg as TgThemeApp).colorScheme : undefined;
  if (cs === 'light' || cs === 'dark') return cs;
  return prefersDark ? 'dark' : 'light';
}

function getTg(): TgThemeApp | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { Telegram?: { WebApp?: TgThemeApp } }).Telegram
    ?.WebApp ?? null;
}

/**
 * Проставляет `data-theme` на `<html>` и обновляет `theme-color`.
 * Реагирует на смену темы на устройстве и событие `themeChanged` Telegram.
 */
export function useTelegramTheme(): void {
  useEffect(() => {
    const tg = getTg();
    const inTg = isInTelegram();
    const mq =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    const apply = () => {
      const scheme = resolveColorScheme(tg, mq?.matches ?? false, inTg);
      document.documentElement.dataset.theme = scheme;
      applyThemeParams(tg);
      updateMetaThemeColor(scheme);
    };

    apply();

    if (inTg && tg?.onEvent) {
      tg.onEvent('themeChanged', apply);
      return () => tg.offEvent?.('themeChanged', apply);
    }
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);
}
