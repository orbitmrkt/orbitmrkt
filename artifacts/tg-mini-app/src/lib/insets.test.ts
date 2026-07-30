import { describe, it, expect } from 'vitest';
import { applyInsets } from './insets';

function makeRoot() {
  const props: Record<string, string> = {};
  const root = {
    style: {
      setProperty: (k: string, v: string) => {
        props[k] = v;
      },
      removeProperty: (k: string) => {
        delete props[k];
      },
    },
  } as unknown as HTMLElement;
  return { root, props };
}

describe('applyInsets', () => {
  it('суммирует safeAreaInset.top и contentSafeAreaInset.top', () => {
    const { root, props } = makeRoot();
    applyInsets(
      { safeAreaInset: { top: 35 }, contentSafeAreaInset: { top: 48 } } as any,
      root,
    );
    expect(props['--tg-content-top']).toBe('83px');
  });

  it('учитывает только доступный inset, недостающий считает за 0', () => {
    const { root, props } = makeRoot();
    applyInsets({ contentSafeAreaInset: { top: 44 } } as any, root);
    expect(props['--tg-content-top']).toBe('44px');
  });

  it('снимает переменную, когда tg отсутствует (браузер)', () => {
    const { root, props } = makeRoot();
    props['--tg-content-top'] = '100px';
    applyInsets(null, root);
    expect(props['--tg-content-top']).toBeUndefined();
  });

  it('снимает переменную при нулевом суммарном отступе', () => {
    const { root, props } = makeRoot();
    props['--tg-content-top'] = '50px';
    applyInsets(
      { safeAreaInset: { top: 0 }, contentSafeAreaInset: { top: 0 } } as any,
      root,
    );
    expect(props['--tg-content-top']).toBeUndefined();
  });

  it('обновляет значение при повторном вызове', () => {
    const { root, props } = makeRoot();
    applyInsets({ contentSafeAreaInset: { top: 40 } } as any, root);
    expect(props['--tg-content-top']).toBe('40px');
    applyInsets({ contentSafeAreaInset: { top: 60 } } as any, root);
    expect(props['--tg-content-top']).toBe('60px');
  });
});
