import { useCart } from '../lib/cart';
import { formatGram, pluralizeGifts } from '../lib/cartMath';
import { hapticSelection } from '../lib/haptics';
import { GramIcon } from './icons';

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, count, remove } = useCart();

  return (
    <div className={`cart-sheet-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="cart-sheet__backdrop" onClick={onClose} />
      <div className="cart-sheet" role="dialog" aria-modal="true">
        <div className="cart-sheet__handle" />
        <div className="cart-sheet__header">
          <span className="cart-sheet__title">Корзина</span>
          <span className="cart-sheet__meta">
            {formatGram(total)} GRAM · {count} {pluralizeGifts(count)}
          </span>
        </div>
        <div className="cart-sheet__list">
          {items.length === 0 ? (
            <div className="cart-sheet__empty">Корзина пуста</div>
          ) : (
            items.map((gift) => (
              <div className="cart-item" key={gift.id}>
                <img
                  className="cart-item__img"
                  src={gift.image}
                  alt={gift.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="cart-item__info">
                  <div className="cart-item__name">{gift.name}</div>
                  <div className="cart-item__number">#{gift.number}</div>
                </div>
                <span className="cart-item__price">
                  <span className="cart-item__price-icon">
                    <GramIcon />
                  </span>
                  {gift.price}
                </span>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => {
                    hapticSelection();
                    remove(gift.id);
                  }}
                  aria-label={`Убрать ${gift.name} из корзины`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
