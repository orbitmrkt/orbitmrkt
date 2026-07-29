import { useEffect } from 'react';

export type ColorScheme = 'light' | 'dark';

interface TgThemeApp {
  colorScheme?: unknown;
  themeParams?: Record<string, unknown>;
  onEvent?: (event: string, cb: () => void) => void;
  offEvent?: (event: string, cb: () => void) => void;
}

/**
 * Прокидывает цвета Telegram-темы (`themeParams`) в CSS-переменные `--tg-theme-*`
 * на `<html>`, чтобы наши токены `--app-*` могли на них опираться. Гарантирует
 * наличие переменных даже если версия клиента их сама не выставляет.
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
 * Определяет цветовую схему: из Telegram (`colorScheme`), иначе из системной темы.
 * Аргументы инъектируются в тестах.
 */
export function resolveColorScheme(
  tg: TgThemeApp | null | undefined,
  prefersDark = false,
): ColorScheme {
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
 * Проставляет `data-theme` на `<html>` по теме Telegram и реагирует на её смену
 * (событие `themeChanged`), с фолбэком на системную `prefers-color-scheme`.
 */
export function useTelegramTheme(): void {
  useEffect(() => {
    const tg = getTg();
    const mq =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    const apply = () => {
      const scheme = resolveColorScheme(tg, mq?.matches ?? false);
      document.documentElement.dataset.theme = scheme;
      applyThemeParams(tg);
    };

    apply();

    if (tg?.onEvent) {
      tg.onEvent('themeChanged', apply);
      return () => tg.offEvent?.('themeChanged', apply);
    }
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);
}
