export interface Gift {
  id: string;
  collection: string;
  name: string;
  number: number;
  image: string;
  price: number;
  /** Цвет модели — зарезервирован под фазу 2 (glow/узоры карточки). */
  accent: string;
}

interface PoolItem {
  collection: string;
  name: string;
  number: number;
  accent: string;
}

/**
 * Выверенный пул реальных гифтов Telegram (все картинки отдают 200 с
 * `nft.fragment.com`). Временный источник для рандом-карточек — в фазе 2
 * заменяется парсингом моделей по ссылке.
 */
const POOL: PoolItem[] = [
  { collection: 'SpringBasket', name: 'Spring Basket', number: 45336, accent: '#4aa3df' },
  { collection: 'PlushPepe', name: 'Plush Pepe', number: 1, accent: '#58b368' },
  { collection: 'DeskCalendar', name: 'Desk Calendar', number: 100, accent: '#e0894a' },
  { collection: 'SantaHat', name: 'Santa Hat', number: 500, accent: '#e05a5a' },
  { collection: 'SignetRing', name: 'Signet Ring', number: 200, accent: '#c0a24a' },
  { collection: 'PreciousPeach', name: 'Precious Peach', number: 300, accent: '#f08a6c' },
  { collection: 'SpicedWine', name: 'Spiced Wine', number: 150, accent: '#a8506e' },
  { collection: 'JellyBunny', name: 'Jelly Bunny', number: 250, accent: '#6c8ef0' },
  { collection: 'DurovsCap', name: "Durov's Cap", number: 50, accent: '#4a90d9' },
  { collection: 'BDayCandle', name: 'B-Day Candle', number: 1000, accent: '#e0b84a' },
  { collection: 'LolPop', name: 'Lol Pop', number: 777, accent: '#e05a9e' },
  { collection: 'HypnoLollipop', name: 'Hypno Lollipop', number: 123, accent: '#8a6cf0' },
  { collection: 'CrystalBall', name: 'Crystal Ball', number: 888, accent: '#4ac0d9' },
  { collection: 'EternalRose', name: 'Eternal Rose', number: 321, accent: '#e05a7a' },
  { collection: 'HangingStar', name: 'Hanging Star', number: 654, accent: '#e0c04a' },
  { collection: 'EvilEye', name: 'Evil Eye', number: 111, accent: '#6c9ef0' },
  { collection: 'SnakeBox', name: 'Snake Box', number: 222, accent: '#58b36e' },
  { collection: 'Cookieheart', name: 'Cookie Heart', number: 333, accent: '#d98a4a' },
  { collection: 'SleighBell', name: 'Sleigh Bell', number: 444, accent: '#c04a4a' },
  { collection: 'LoveCandle', name: 'Love Candle', number: 555, accent: '#e06a9e' },
  { collection: 'HomemadeCake', name: 'Homemade Cake', number: 99, accent: '#d9a04a' },
  { collection: 'GemSignet', name: 'Gem Signet', number: 77, accent: '#6cc0f0' },
  { collection: 'MadPumpkin', name: 'Mad Pumpkin', number: 42, accent: '#e0894a' },
  { collection: 'ScaredCat', name: 'Scared Cat', number: 13, accent: '#8a8a9e' },
  { collection: 'GingerCookie', name: 'Ginger Cookie', number: 7, accent: '#d9944a' },
];

const MIN_PRICE = 0.5;
const MAX_PRICE = 250;

function randomPrice(): number {
  return (
    Math.round((MIN_PRICE + Math.random() * (MAX_PRICE - MIN_PRICE)) * 10) / 10
  );
}

/** Генерирует `count` рандом-карточек из выверенного пула реальных гифтов. */
export function randomGifts(count: number): Gift[] {
  const out: Gift[] = [];
  for (let i = 0; i < count; i++) {
    const base = POOL[Math.floor(Math.random() * POOL.length)];
    out.push({
      id: `${base.collection}-${i}`,
      collection: base.collection,
      name: base.name,
      number: base.number,
      image: `https://nft.fragment.com/gift/${base.collection}-${base.number}.medium.jpg`,
      price: randomPrice(),
      accent: base.accent,
    });
  }
  return out;
}
