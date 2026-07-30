import { hapticSelection, hapticImpact } from '../lib/haptics';
import { useCart } from '../lib/cart';
import { useGiftDetail } from '../lib/giftDetail';
import { GramIcon, BasketIcon } from './icons';
import type { Gift } from '../lib/mockGifts';

export function GiftCard({ gift }: { gift: Gift }) {
  const { has, toggle } = useCart();
  const { openGift } = useGiftDetail();
  const inBasket = has(gift.id);

  return (
    <div className="gift-card">
      <button
        type="button"
        className="gift-card__media"
        onClick={() => {
          hapticSelection();
          openGift(gift);
        }}
        aria-label={`${gift.name} #${gift.number}`}
      >
        <img
          className="gift-card__img"
          src={gift.image}
          alt={gift.name}
          loading="lazy"
          decoding="async"
        />
      </button>

      <div className="gift-card__body">
        <div className="gift-card__name">{gift.name}</div>
        <div className="gift-card__number">#{gift.number} · Minted</div>

        <div className="gift-card__actions">
          <button
            type="button"
            className="gift-card__price"
            onClick={() => hapticSelection()}
            aria-label={`Цена ${gift.price} GRAM`}
          >
            <span className="gift-card__price-icon">
              <GramIcon />
            </span>
            <span className="gift-card__price-value">{gift.price}</span>
          </button>

          <button
            type="button"
            className={`gift-card__basket${inBasket ? ' is-in' : ''}`}
            onClick={() => {
              hapticImpact('light');
              toggle(gift);
            }}
            aria-label={inBasket ? 'Убрать из корзины' : 'В корзину'}
          >
            <BasketIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
