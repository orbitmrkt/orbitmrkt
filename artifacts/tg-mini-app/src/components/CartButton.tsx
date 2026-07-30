import { useEffect, useState } from 'react';
import { useCart } from '../lib/cart';
import { formatGram, pluralizeGifts } from '../lib/cartMath';
import { hapticImpact } from '../lib/haptics';
import { BasketIcon, DiamondIcon } from './icons';

// Должно совпадать с длительностью анимации cart-fab-out в index.css.
const EXIT_MS = 300;

export function CartButton({ onOpen }: { onOpen: () => void }) {
  const { count, total } = useCart();
  const [rendered, setRendered] = useState(count > 0);
  // Снимок последних ненулевых значений — чтобы во время ухода не мигал «0».
  const [snap, setSnap] = useState({ count, total });

  // Появился товар — показываем и запоминаем актуальные значения.
  useEffect(() => {
    if (count > 0) {
      setRendered(true);
      setSnap({ count, total });
    }
  }, [count, total]);

  // Уход вычисляется синхронно в рендере: анимация стартует в том же кадре.
  const leaving = rendered && count === 0;

  // По завершении exit-анимации — размонтируем.
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setRendered(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!rendered) return null;

  const shownCount = count > 0 ? count : snap.count;
  const shownTotal = count > 0 ? total : snap.total;

  return (
    <button
      type="button"
      className={`cart-fab${leaving ? ' is-leaving' : ''}`}
      onClick={() => {
        hapticImpact('light');
        onOpen();
      }}
      aria-label={`Корзина: ${shownCount} ${pluralizeGifts(shownCount)}, ${formatGram(shownTotal)} GRAM`}
    >
      <span className="cart-fab__icon">
        <BasketIcon />
      </span>
      <span className="cart-fab__text">
        <span className="cart-fab__sum">
          {formatGram(shownTotal)}
          <span className="cart-fab__coin">
            <DiamondIcon />
          </span>
        </span>
        <span className="cart-fab__count">
          {shownCount} {pluralizeGifts(shownCount)}
        </span>
      </span>
    </button>
  );
}
