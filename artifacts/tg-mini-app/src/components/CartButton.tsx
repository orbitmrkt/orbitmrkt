import { useEffect, useState } from 'react';
import { useCart } from '../lib/cart';
import { formatGram, pluralizeGifts } from '../lib/cartMath';
import { hapticImpact } from '../lib/haptics';
import { BasketIcon } from './icons';

const EXIT_MS = 280;

export function CartButton({ onOpen }: { onOpen: () => void }) {
  const { count, total } = useCart();
  const [mounted, setMounted] = useState(count > 0);
  const [leaving, setLeaving] = useState(false);
  // Снимок последних ненулевых значений — чтобы во время ухода не мигал «0».
  const [snap, setSnap] = useState({ count, total });

  useEffect(() => {
    if (count > 0) {
      setSnap({ count, total });
      setMounted(true);
      setLeaving(false);
      return;
    }
    if (mounted) {
      setLeaving(true);
      const t = setTimeout(() => {
        setMounted(false);
        setLeaving(false);
      }, EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [count, total, mounted]);

  if (!mounted) return null;

  const shownCount = leaving ? snap.count : count;
  const shownTotal = leaving ? snap.total : total;

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
        <span className="cart-fab__sum">{formatGram(shownTotal)} GRAM</span>
        <span className="cart-fab__count">
          {shownCount} {pluralizeGifts(shownCount)}
        </span>
      </span>
    </button>
  );
}
