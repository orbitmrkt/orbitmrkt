import { useState } from 'react';
import { useCart } from '../lib/cart';
import {
  formatGram,
  pluralizeGifts,
  selectedItems,
  selectedTotal,
  isAllSelected,
} from '../lib/cartMath';
import { hapticSelection, hapticImpact } from '../lib/haptics';
import { DiamondIcon } from './icons';

// Мок баланса — реальный придёт отдельной фазой (сейчас 0).
const BALANCE = 0;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove } = useCart();
  // Храним СНЯТЫЕ id — так новые товары по умолчанию выбраны.
  const [deselected, setDeselected] = useState<Set<string>>(new Set());

  const selCount = selectedItems(items, deselected).length;
  const selTotal = selectedTotal(items, deselected);
  const allSelected = isAllSelected(items, deselected);
  const insufficient = selCount === 0 || selTotal > BALANCE;

  const toggleOne = (id: string) => {
    hapticSelection();
    setDeselected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    hapticSelection();
    setDeselected(allSelected ? new Set(items.map((g) => g.id)) : new Set());
  };

  const deleteSelected = () => {
    if (selCount === 0) return;
    hapticImpact('medium');
    selectedItems(items, deselected).forEach((g) => remove(g.id));
  };

  const onBuy = () => {
    hapticImpact('light');
    // Визуал: реальный платёж (Stars/TON) — отдельной фазой.
  };

  return (
    <div className={`cart-sheet-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="cart-sheet__backdrop" onClick={onClose} />
      <div className="cart-sheet" role="dialog" aria-modal="true">
        <div className="cart-sheet__handle" />
        <div className="cart-sheet__header">
          <span className="cart-sheet__title">Корзина</span>
          <span className="cart-sheet__meta">
            {items.length} {pluralizeGifts(items.length)}
          </span>
        </div>

        {items.length > 0 && (
          <div className="cart-selbar">
            <button type="button" className="cart-selbar__all" onClick={toggleAll}>
              {allSelected ? 'Снять выделение' : 'Выбрать все'}
            </button>
            <button
              type="button"
              className="cart-selbar__del"
              onClick={deleteSelected}
              disabled={selCount === 0}
            >
              Удалить{selCount > 0 ? `: ${selCount}` : ''}
            </button>
          </div>
        )}

        <div className="cart-sheet__list">
          {items.length === 0 ? (
            <div className="cart-sheet__empty">Корзина пуста</div>
          ) : (
            items.map((gift) => {
              const sel = !deselected.has(gift.id);
              return (
                <button
                  type="button"
                  className={`cart-item${sel ? ' is-selected' : ''}`}
                  key={gift.id}
                  onClick={() => toggleOne(gift.id)}
                  aria-pressed={sel}
                >
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
                      <DiamondIcon />
                    </span>
                    {gift.price}
                  </span>
                  <span className={`cart-check${sel ? ' is-on' : ''}`} aria-hidden="true">
                    {sel && <CheckIcon />}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <button
            type="button"
            className={`cart-buy${insufficient ? ' is-dim' : ''}`}
            onClick={onBuy}
          >
            <span>Купить за {formatGram(selTotal)}</span>
            <span className="cart-buy__coin">
              <DiamondIcon />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
