import { useEffect, useState } from 'react';

export interface TgRating {
  level: number;
  rating: number | null;
  currentLevelRating: number | null;
  nextLevelRating: number | null;
}

function getInitData(): string | null {
  if (typeof window === 'undefined') return null;
  const d = (window as unknown as {
    Telegram?: { WebApp?: { initData?: unknown } };
  }).Telegram?.WebApp?.initData;
  return typeof d === 'string' && d.length > 0 ? d : null;
}

/**
 * Загружает Telegram-рейтинг (StarsRating) текущего пользователя через `/api/rating`
 * (бэкенд валидирует initData по токену бота и зовёт getChat). Возвращает null, пока
 * не загрузилось / если рейтинга нет / вне Telegram.
 */
export function useTgRating(): TgRating | null {
  const [rating, setRating] = useState<TgRating | null>(null);

  useEffect(() => {
    const initData = getInitData();
    if (!initData) return;
    let cancelled = false;

    fetch('/api/rating', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: unknown) => {
        if (cancelled) return;
        if (j && typeof (j as TgRating).level === 'number') {
          setRating(j as TgRating);
        }
      })
      .catch(() => {
        /* сеть/бэкенд недоступен — просто без рейтинга */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return rating;
}
