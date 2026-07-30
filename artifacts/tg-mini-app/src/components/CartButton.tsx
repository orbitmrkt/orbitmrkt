import { useCart } from '../lib/cart';
import { formatGram, pluralizeGifts } from '../lib/cartMath';
import { hapticImpact } from '../lib/haptics';
import { BasketIcon } from './icons';

export function CartButton({ onOpen }: { onOpen: () => void }) {
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <button
      type="button"
      className="cart-fab"
      onClick={() => {
        hapticImpact('light');
        onOpen();
      }}
      aria-label={`Корзина: ${count} ${pluralizeGifts(count)}, ${formatGram(total)} GRAM`}
    >
      <span className="cart-fab__icon">
        <BasketIcon />
      </span>
      <span className="cart-fab__text">
        <span className="cart-fab__sum">{formatGram(total)} GRAM</span>
        <span className="cart-fab__count">
          {count} {pluralizeGifts(count)}
        </span>
      </span>
    </button>
  );
}
