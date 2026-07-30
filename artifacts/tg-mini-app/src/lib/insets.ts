import { useEffect } from 'react';

interface Inset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface TgWithInsets {
  safeAreaInset?: Partial<Inset>;
  contentSafeAreaInset?: Partial<Inset>;
  onEvent?(event: string, cb: () => void): void;
  offEvent?(event: string, cb: () => void): void;
}

function getTg(): TgWithInsets | null {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp ?? null;
}

/**
 * Считает суммарный верхний отступ (safe-area устройства + шапка Telegram)
 * и пишет его в CSS-переменную `--tg-content-top` на переданном элементе.
 * Если отступ 0 (браузер/старый клиент) — переменная снимается, чтобы
 * в CSS работал фолбэк. Экспортируется отдельно для тестов.
 */
export function applyInsets(tg: TgWithInsets | null, root: HTMLElement): void {
  const safeTop = tg?.safeAreaInset?.top ?? 0;
  const contentTop = tg?.contentSafeAreaInset?.top ?? 0;
  const total = safeTop + contentTop;
  if (total > 0) {
    root.style.setProperty('--tg-content-top', `${total}px`);
  } else {
    root.style.removeProperty('--tg-content-top');
  }
}

/**
 * Подключает адаптацию под safe-area Telegram: ставит `--tg-content-top`
 * на <html> и обновляет её по событиям safeAreaChanged/contentSafeAreaChanged.
 */
export function useTelegramInsets(): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const update = () => applyInsets(getTg(), root);
    update();
    const tg = getTg();
    if (tg?.onEvent) {
      tg.onEvent('safeAreaChanged', update);
      tg.onEvent('contentSafeAreaChanged', update);
    }
    return () => {
      const t = getTg();
      if (t?.offEvent) {
        t.offEvent('safeAreaChanged', update);
        t.offEvent('contentSafeAreaChanged', update);
      }
    };
  }, []);
}
