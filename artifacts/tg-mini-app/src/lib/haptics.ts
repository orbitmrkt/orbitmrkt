interface HapticApp {
  HapticFeedback?: {
    selectionChanged(): void;
    impactOccurred(style: string): void;
  };
}

function getTg(): HapticApp | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as unknown as { Telegram?: { WebApp?: HapticApp } }).Telegram
      ?.WebApp ?? null
  );
}

export function hapticSelection(): void {
  try {
    getTg()?.HapticFeedback?.selectionChanged();
  } catch {
    /* noop — вне Telegram или не поддерживается */
  }
}

export function hapticImpact(
  style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light',
): void {
  try {
    getTg()?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* noop */
  }
}
