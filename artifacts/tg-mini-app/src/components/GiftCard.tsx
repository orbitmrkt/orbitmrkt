import { useState } from 'react';
import { hapticSelection, hapticImpact } from '../lib/haptics';
import type { Gift } from '../lib/mockGifts';

function GramIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path
        d="M52.017 12.097H27.984c-3.201 0-4.802 0-6.25.448a10 10 0 0 0-3.496 1.909c-1.159.975-2.024 2.322-3.755 5.014l-7.64 11.884c-1.144 1.78-1.716 2.668-1.87 3.605a4.6 4.6 0 0 0 .263 2.45c.35.882 1.098 1.63 2.593 3.125L36.217 68.92c1.325 1.324 1.987 1.986 2.75 2.234a3.34 3.34 0 0 0 2.067 0c.763-.248 1.425-.91 2.75-2.234l28.388-28.388c1.495-1.495 2.243-2.243 2.593-3.125.31-.778.4-1.625.263-2.45-.155-.937-.727-1.826-1.87-3.605l-7.64-11.884c-1.73-2.692-2.596-4.039-3.756-5.014a10 10 0 0 0-3.496-1.91c-1.448-.447-3.048-.447-6.249-.447"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M47.465 21.472c.39-1.055 1.883-1.055 2.274 0l2.698 7.292a1.6 1.6 0 0 0 .945.946l7.293 2.698c1.055.39 1.055 1.883 0 2.274l-7.293 2.698a1.6 1.6 0 0 0-.945.945l-2.698 7.293c-.39 1.055-1.883 1.055-2.274 0l-2.698-7.293a1.6 1.6 0 0 0-.946-.945l-7.292-2.698c-1.055-.39-1.055-1.883 0-2.274l7.292-2.698a1.6 1.6 0 0 0 .946-.946z"
        fill="currentColor"
      />
    </svg>
  );
}

function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="9.5" y="2" width="5" height="3" rx="1.5" fill="currentColor" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.5 10.5c-.5 0-1 .5-1 1 0 .2.1.4.2.6l2.1 7.1c.3 1 1.3 1.8 2.4 1.8h9.6c1.1 0 2.1-.8 2.4-1.8l2.1-7.1c.1-.2.2-.4.2-.6 0-.5-.5-1-1-1zM8 13.5a1 1 0 0 1 1 1V17a1 1 0 0 1-2 0v-2.5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1V17a1 1 0 0 1-2 0v-2.5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1V17a1 1 0 0 1-2 0v-2.5a1 1 0 0 1 1-1"
      />
    </svg>
  );
}

export function GiftCard({ gift }: { gift: Gift }) {
  const [inBasket, setInBasket] = useState(false);

  return (
    <div className="gift-card">
      <div className="gift-card__media-wrap">
        <button
          type="button"
          className="gift-card__media"
          onClick={() => hapticSelection()}
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

        <button
          type="button"
          className={`gift-card__basket${inBasket ? ' is-in' : ''}`}
          onClick={() => {
            hapticImpact('light');
            setInBasket((v) => !v);
          }}
          aria-label={inBasket ? 'Убрать из корзины' : 'В корзину'}
        >
          <BasketIcon />
        </button>
      </div>

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
        </div>
      </div>
    </div>
  );
}
