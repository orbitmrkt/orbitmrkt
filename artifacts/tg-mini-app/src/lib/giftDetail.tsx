import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Gift } from './mockGifts';
import { giftSlug, parseNftAttributes, type NftAttributes } from './nftAttrs';

/* ─── Контекст открытия окна подарка ──────────────────────────────────── */

interface GiftDetailCtx {
  gift: Gift | null;
  open: boolean;
  openGift: (g: Gift) => void;
  close: () => void;
}

const Ctx = createContext<GiftDetailCtx | null>(null);

const CLOSE_MS = 340; // синхр. с анимацией .gd-sheet

export function GiftDetailProvider({ children }: { children: ReactNode }) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [open, setOpen] = useState(false);

  const value = useMemo<GiftDetailCtx>(
    () => ({
      gift,
      open,
      openGift: (g) => {
        setGift(g);
        setOpen(true);
      },
      close: () => {
        setOpen(false);
        window.setTimeout(() => setGift(null), CLOSE_MS);
      },
    }),
    [gift, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGiftDetail(): GiftDetailCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useGiftDetail must be used within GiftDetailProvider');
  return c;
}

/* ─── Загрузка деталей подарка ────────────────────────────────────────── */

export interface GiftDetailsData {
  loading: boolean;
  /** Атрибуты инстанса (имена + редкость) — парс t.me/nft через /api/nft. */
  attrs: NftAttributes | null;
  /** Полный Lottie карточки (модель+узор+фон) с fragment.com через /api/giftLottie. */
  cardData: unknown | null;
  /** Крупное статичное превью (fragment .large) — фолбэк пока грузится Lottie. */
  fallbackImg: string;
  ogImage: string | null;
  name: string | null;
}

const EMPTY: GiftDetailsData = {
  loading: false,
  attrs: null,
  cardData: null,
  fallbackImg: '',
  ogImage: null,
  name: null,
};

/**
 * По подарку тянет: полный Lottie карточки (fragment, слои модель+узор+фон —
 * аутентичный рендер Telegram) и атрибуты (t.me/nft: имена + редкость). Оба
 * запроса параллельно, через наши /api-прокси (обход CORS).
 */
export function useGiftDetails(gift: Gift | null): GiftDetailsData {
  const [data, setData] = useState<GiftDetailsData>(EMPTY);

  useEffect(() => {
    if (!gift) return;
    let cancelled = false;
    const slug = giftSlug(gift.collection, gift.number);
    const fallbackImg = `https://nft.fragment.com/gift/${slug}.large.jpg`;
    setData({ ...EMPTY, loading: true, fallbackImg });

    const attrsP = fetch(`/api/nft?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    const cardP = fetch(`/api/giftLottie?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);

    Promise.all([attrsP, cardP]).then(([j, card]) => {
      if (cancelled) return;
      const meta = j as {
        table?: string;
        ogImage?: string | null;
        ogTitle?: string | null;
      } | null;
      setData({
        loading: false,
        attrs: meta ? parseNftAttributes(meta.table ?? '') : null,
        cardData: card ?? null,
        fallbackImg,
        ogImage: meta?.ogImage ?? null,
        name: meta?.ogTitle ?? gift.name,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [gift]);

  return data;
}
