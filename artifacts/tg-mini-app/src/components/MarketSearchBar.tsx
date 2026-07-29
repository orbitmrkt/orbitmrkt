import { useState } from 'react';

const FILTER_CHIPS = ['Коллекция', 'Модель', 'Тип'];

function getTg() {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp ?? null;
}

function hapticSelection() {
  try {
    getTg()?.HapticFeedback?.selectionChanged();
  } catch { /* noop */ }
}

export function MarketSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  return (
    <div className="msb-root">
      {/* Row 1: search (full width) */}
      <div className="msb-row1">
        <div className="msb-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="msb-search-icon">
            <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            className="msb-input"
            type="text"
            placeholder="Быстрый поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2: scrollable filter chips + fixed action buttons */}
      <div className="msb-row2">
        <div className="msb-chips">
          {FILTER_CHIPS.map((label, i) => (
            <button
              key={i}
              className={`msb-chip${activeFilter === i ? ' msb-chip-active' : ''}`}
              onClick={() => {
                hapticSelection();
                setActiveFilter(activeFilter === i ? null : i);
              }}
            >
              <span>{label}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="msb-chip-arrow">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="msb-actions">
          {/* Sort */}
          <button
            className="msb-action-btn"
            onClick={() => hapticSelection()}
            aria-label="Фильтр"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6 12H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M10 18H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Price/sort toggle */}
          <button
            className={`msb-action-btn${!sortAsc ? ' msb-chip-active' : ''}`}
            onClick={() => {
              hapticSelection();
              setSortAsc(!sortAsc);
            }}
            aria-label="Сортировка по цене"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 3L7 21M7 21L4 18M7 21L10 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 21L17 3M17 3L14 6M17 3L20 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
