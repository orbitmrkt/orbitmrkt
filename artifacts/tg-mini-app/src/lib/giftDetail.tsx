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
import {
  backdropsUrl,
  findBackdrop,
  modelLottieUrl,
  symbolPngUrl,
  type BackdropColors,
} from './changesApi';

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

/* ─── Загрузка деталей подарка (t.me/nft + changes.tg) ────────────────── */

export interface GiftDetailsData {
  loading: boolean;
  attrs: NftAttributes | null;
  colors: BackdropColors | null;
  modelData: unknown | null;
  symbolPng: string | null;
  ogImage: string | null;
  name: string | null;
}

const EMPTY: GiftDetailsData = {
  loading: false,
  attrs: null,
  colors: null,
  modelData: null,
  symbolPng: null,
  ogImage: null,
  name: null,
};

/**
 * По подарку тянет реальные атрибуты (через наш /api/nft, парс t.me/nft) и ассеты
 * из changes.tg: Lottie модели, PNG узора, hex-цвета фона. thanks to @GiftChanges.
 */
export function useGiftDetails(gift: Gift | null): GiftDetailsData {
  const [data, setData] = useState<GiftDetailsData>(EMPTY);

  useEffect(() => {
    if (!gift) return;
    let cancelled = false;
    setData({ ...EMPTY, loading: true });

    (async () => {
      try {
        const slug = giftSlug(gift.collection, gift.number);
        const r = await fetch(`/api/nft?slug=${encodeURIComponent(slug)}`);
        const j = (await r.json()) as {
          table?: string;
          ogImage?: string | null;
          ogTitle?: string | null;
        };
        if (cancelled) return;
        const attrs = parseNftAttributes(j.table ?? '');
        setData((d) => ({
          ...d,
          attrs,
          ogImage: j.ogImage ?? null,
          name: j.ogTitle ?? gift.name,
          symbolPng: attrs.symbol
            ? symbolPngUrl(gift.collection, attrs.symbol.name)
            : null,
        }));

        if (attrs.backdrop) {
          try {
            const br = await fetch(backdropsUrl(gift.collection));
            const list = await br.json();
            if (!cancelled) {
              setData((d) => ({ ...d, colors: findBackdrop(list, attrs.backdrop!.name) }));
            }
          } catch {
            /* цвета фона недоступны — рендерим без градиента */
          }
        }

        if (attrs.model) {
          try {
            const mr = await fetch(modelLottieUrl(gift.collection, attrs.model.name));
            const mj = await mr.json();
            if (!cancelled) setData((d) => ({ ...d, modelData: mj }));
          } catch {
            /* Lottie модели недоступна — покажем превью */
          }
        }
      } catch {
        /* сеть/прокси недоступны */
      } finally {
        if (!cancelled) setData((d) => ({ ...d, loading: false }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gift]);

  return data;
}
