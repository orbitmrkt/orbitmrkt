import Lottie from 'lottie-react';
import {
  useGiftDetail,
  useGiftDetails,
  type GiftDetailsData,
} from '../lib/giftDetail';
import { giftSlug, type NftAttr } from '../lib/nftAttrs';
import { formatGram } from '../lib/cartMath';
import { hapticSelection, hapticImpact } from '../lib/haptics';
import { DiamondIcon } from './icons';

function openTgLink(url: string) {
  try {
    const tg = (
      window as unknown as {
        Telegram?: { WebApp?: { openTelegramLink?: (u: string) => void } };
      }
    ).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url);
      return;
    }
  } catch {
    /* noop */
  }
  try {
    window.open(url, '_blank');
  } catch {
    /* noop */
  }
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8.6 13.4l6.8 4M15.4 6.6l-6.8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AttrRow({ label, attr }: { label: string; attr: NftAttr | null | undefined }) {
  if (!attr) return null;
  return (
    <div className="gd-attr">
      <span className="gd-attr__label">{label}</span>
      <span className="gd-attr__val">
        <span className="gd-attr__name">{attr.name}</span>
        {attr.rarity && <span className="gd-attr__rarity">{attr.rarity}</span>}
      </span>
    </div>
  );
}

export function GiftDetailSheet() {
  const { gift, open, close } = useGiftDetail();
  const d: GiftDetailsData = useGiftDetails(gift);
  const slug = gift ? giftSlug(gift.collection, gift.number) : '';
  const c = d.colors;

  return (
    <div className={`gd-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="gd-backdrop" onClick={close} />
      <div className="gd-sheet" role="dialog" aria-modal="true">
        <div className="gd-handle" />
        {gift && (
          <>
            <div
              className="gd-card"
              style={
                c
                  ? { background: `radial-gradient(circle at 50% 38%, ${c.centerColor}, ${c.edgeColor})` }
                  : undefined
              }
            >
              {d.symbolPng && c && (
                <div
                  className="gd-pattern"
                  style={{
                    WebkitMaskImage: `url("${d.symbolPng}")`,
                    maskImage: `url("${d.symbolPng}")`,
                    backgroundColor: c.patternColor,
                  }}
                />
              )}
              <div className="gd-card__actions">
                <button
                  type="button"
                  className="gd-iconbtn"
                  aria-label="Смотреть в Telegram"
                  onClick={() => {
                    hapticSelection();
                    openTgLink(`https://t.me/nft/${slug}`);
                  }}
                >
                  <EyeIcon />
                </button>
                <button
                  type="button"
                  className="gd-iconbtn"
                  aria-label="Поделиться"
                  onClick={() => {
                    hapticSelection();
                    openTgLink(
                      `https://t.me/share/url?url=${encodeURIComponent(
                        `https://t.me/OrbitMrktBot/app?startapp=gift_${slug}`,
                      )}`,
                    );
                  }}
                >
                  <ShareIcon />
                </button>
              </div>
              <div className="gd-model">
                {d.modelData ? (
                  <Lottie animationData={d.modelData as object} loop autoplay />
                ) : (
                  <img src={d.ogImage ?? gift.image} alt={gift.name} />
                )}
              </div>
              <div className="gd-card__title" style={c ? { color: c.textColor } : undefined}>
                <span className="gd-name">{d.name ?? gift.name}</span>
                <span className="gd-number">#{gift.number}</span>
              </div>
            </div>

            <div className="gd-attrs">
              <AttrRow label="Model" attr={d.attrs?.model} />
              <AttrRow label="Symbol" attr={d.attrs?.symbol} />
              <AttrRow label="Backdrop" attr={d.attrs?.backdrop} />
              <div className="gd-attr gd-attr--min">
                <span className="gd-attr__label">Мин. цена</span>
                <span className="gd-attr__price">
                  <span className="gd-coin">
                    <DiamondIcon />
                  </span>
                  {formatGram(gift.price)}
                </span>
              </div>
            </div>

            <div className="gd-buttons">
              <button type="button" className="gd-offer" onClick={() => hapticImpact('light')}>
                Сделать оффер
              </button>
              <button type="button" className="gd-buy" onClick={() => hapticImpact('light')}>
                Купить за {formatGram(gift.price)}
                <span className="gd-coin">
                  <DiamondIcon />
                </span>
              </button>
            </div>

            <div className="gd-credit">data · @GiftChanges</div>
          </>
        )}
      </div>
    </div>
  );
}
