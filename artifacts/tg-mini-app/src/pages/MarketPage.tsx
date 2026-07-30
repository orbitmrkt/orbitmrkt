import { useMemo } from 'react';
import { MarketSearchBar } from '../components/MarketSearchBar';
import { GiftCard } from '../components/GiftCard';
import { randomGifts } from '../lib/mockGifts';

export function MarketPage() {
  // ВРЕМЕННО: рандом-карточки из выверенного пула (фаза 2 — реальные модели по ссылке).
  const gifts = useMemo(() => randomGifts(24), []);

  return (
    <div className="market-page">
      <MarketSearchBar />
      <div className="gift-grid">
        {gifts.map((g) => (
          <GiftCard key={g.id} gift={g} />
        ))}
      </div>
    </div>
  );
}
