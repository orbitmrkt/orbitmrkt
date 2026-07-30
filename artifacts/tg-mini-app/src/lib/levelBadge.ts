export interface LevelBadgeInfo {
  /** Ключ ассета: lvl1..lvl9 или lvl10/lvl20/.../lvl90. */
  key: string;
  /** Число, которое нужно дорисовать поверх (для 10+), иначе null. */
  draw: string | null;
}

/**
 * По уровню возвращает, какой значок-эмодзи показать и нужно ли рисовать число.
 * 1..9 — точный эмодзи (draw=null); 10..99 — форма десятка ({tens}0) + число;
 * 100+ — клампится к форме 90 и рисует полное число. <1/NaN — null (значка нет).
 */
export function levelBadge(level: number): LevelBadgeInfo | null {
  if (!Number.isFinite(level)) return null;
  const lvl = Math.floor(level);
  if (lvl < 1) return null;
  if (lvl <= 9) return { key: `lvl${lvl}`, draw: null };
  const tens = Math.min(9, Math.floor(lvl / 10)) * 10; // 10..90
  return { key: `lvl${tens}`, draw: String(lvl) };
}
