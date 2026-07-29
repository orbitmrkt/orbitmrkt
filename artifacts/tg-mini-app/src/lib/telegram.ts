/**
 * Определение среды запуска: Mini App внутри Telegram vs обычный браузер.
 * Скрипт telegram-web-app.js подключён всегда, поэтому window.Telegram.WebApp
 * существует и в браузере — отличаем по platform и наличию initData/пользователя.
 */

interface TgWebApp {
  platform?: unknown;
  initData?: unknown;
  initDataUnsafe?: { user?: unknown };
}

interface TgWindow {
  Telegram?: { WebApp?: TgWebApp };
}

function resolveWindow(): TgWindow | undefined {
  return typeof window !== 'undefined'
    ? (window as unknown as TgWindow)
    : undefined;
}

/**
 * true — приложение открыто как Telegram Mini App; false — обычный браузер.
 * Аргумент win инъектируется в тестах.
 */
export function isInTelegram(
  win: TgWindow | undefined = resolveWindow(),
): boolean {
  const tg = win?.Telegram?.WebApp;
  if (!tg || typeof tg !== 'object') return false;

  const platform = typeof tg.platform === 'string' ? tg.platform : 'unknown';
  const hasInitData = typeof tg.initData === 'string' && tg.initData.length > 0;
  const hasUser = !!tg.initDataUnsafe?.user;

  const knownPlatform = platform !== '' && platform !== 'unknown';
  return knownPlatform || hasInitData || hasUser;
}
