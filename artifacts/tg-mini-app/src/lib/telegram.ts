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

export interface TgUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isPremium?: boolean;
}

/** Достаёт данные пользователя из initDataUnsafe (или null вне Telegram). */
export function getTelegramUser(
  win: TgWindow | undefined = resolveWindow(),
): TgUser | null {
  const u = win?.Telegram?.WebApp?.initDataUnsafe?.user as
    | Record<string, unknown>
    | undefined;
  if (!u || typeof u !== 'object') return null;
  return {
    id: typeof u.id === 'number' ? u.id : undefined,
    firstName: typeof u.first_name === 'string' ? u.first_name : undefined,
    lastName: typeof u.last_name === 'string' ? u.last_name : undefined,
    username: typeof u.username === 'string' ? u.username : undefined,
    photoUrl: typeof u.photo_url === 'string' ? u.photo_url : undefined,
    isPremium: u.is_premium === true,
  };
}
