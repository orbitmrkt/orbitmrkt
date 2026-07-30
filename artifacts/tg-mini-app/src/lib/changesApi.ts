// Клиент публичного API changes.tg (Telegram Star Gifts).
// thanks to @GiftChanges (api.changes.tg) — обязательная атрибуция по условиям API.
// Видимый пользователю кредит показывается в UI (окно подарка / профиль).

const BASE = 'https://api.changes.tg';

export interface BackdropColors {
  centerColor: string;
  edgeColor: string;
  patternColor: string;
  textColor: string;
}

interface BackdropEntry {
  name: string;
  hex?: BackdropColors;
}

/** URL Lottie-JSON модели подарка. */
export function modelLottieUrl(collection: string, model: string): string {
  return `${BASE}/model/${encodeURIComponent(collection)}/${encodeURIComponent(model)}.json`;
}

/** URL PNG узора (symbol) заданного размера — для тайлинга фона. */
export function symbolPngUrl(collection: string, symbol: string, size = 128): string {
  return `${BASE}/symbol/${encodeURIComponent(collection)}/${encodeURIComponent(symbol)}.png?size=${size}`;
}

/** URL списка бэкдропов подарка (с hex-цветами). */
export function backdropsUrl(collection: string): string {
  return `${BASE}/backdrops/${encodeURIComponent(collection)}`;
}

/** Ищет бэкдроп по имени в списке от /backdrops/:gift, возвращает hex-цвета (или null). */
export function findBackdrop(
  list: readonly BackdropEntry[],
  name: string,
): BackdropColors | null {
  if (!Array.isArray(list)) return null;
  const key = name.trim().toLowerCase();
  const b = list.find((x) => x?.name?.trim().toLowerCase() === key);
  return b?.hex ?? null;
}
