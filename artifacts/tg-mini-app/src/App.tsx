import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './assets/animation.json';
import orbitLogo from './assets/orbit-market-logo.svg';
import orbitAvatar from './assets/orbit-avatar.png';
import LogoNavbar from './assets/logo-navbar.svg?react';
import myGiftData from './assets/my-gift-icon.json';
import profileData from './assets/profile-icon.json';
import { isInTelegram } from './lib/telegram';
import { useTelegramTheme } from './lib/theme';
import { useTelegramInsets } from './lib/insets';
import { isHeaderRevealed } from './lib/scroll';
import BrowserGate from './components/BrowserGate';
import { CartProvider } from './lib/cart';
import { CartButton } from './components/CartButton';
import { CartSheet } from './components/CartSheet';
import { DiamondIcon } from './components/icons';

/* ─── Telegram setup ──────────────────────────────────────────────────── */

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  requestFullscreen?(): void;
  openTelegramLink?(url: string): void;
  HapticFeedback?: {
    selectionChanged(): void;
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  };
}

function getTg(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp ?? null;
}

function hapticSelection() {
  try {
    getTg()?.HapticFeedback?.selectionChanged();
  } catch { /* noop */ }
}

const BOT_URL = 'https://t.me/OrbitMrktBot';

function openBot() {
  try {
    const tg = getTg();
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(BOT_URL);
      return;
    }
  } catch { /* noop */ }
  try {
    window.open(BOT_URL, '_blank');
  } catch { /* noop */ }
}

function useTelegramSetup() {
  useEffect(() => {
    const tg = getTg();
    if (!tg) return;
    try { tg.ready(); }               catch { /* noop */ }
    try { tg.expand(); }              catch { /* noop */ }
    try { tg.requestFullscreen?.(); } catch { /* unsupported */ }
  }, []);
}

/* ─── Progress bar ────────────────────────────────────────────────────── */

const LOAD_DURATION = 2.0; // seconds

function ProgressBar({ duration }: { duration: number }) {
  const [fill, setFill] = useState(0);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => setFill(100));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        width: 300,
        height: 8,
        borderRadius: 999,
        backgroundColor: 'var(--app-elevate)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${fill}%`,
          borderRadius: 999,
          transition: `width ${duration}s linear`,
          background: [
            'repeating-linear-gradient(-52deg, transparent 0px, transparent 8px, rgba(255,255,255,0.18) 8px, rgba(255,255,255,0.18) 16px)',
            'linear-gradient(to right, #3b9eff, #2272e8)',
          ].join(','),
        }}
      />
    </div>
  );
}

/* ─── Loading screen ──────────────────────────────────────────────────── */

const FADE_MS = 400;

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setFading(true);
      timerRef.current = setTimeout(onDone, FADE_MS);
    }, LOAD_DURATION * 1000);

    return () => {
      clearTimeout(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onDone]);

  /* ─── SVG star shape ─────────────────────────────────────────────────── */
  const Star = ({ size, color = 'var(--app-text-strong)' }: { size: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 C12 2 12.8 7.5 14.5 9.5 C16.2 11.5 22 12 22 12 C22 12 16.2 12.5 14.5 14.5 C12.8 16.5 12 22 12 22 C12 22 11.2 16.5 9.5 14.5 C7.8 12.5 2 12 2 12 C2 12 7.8 11.5 9.5 9.5 C11.2 7.5 12 2 12 2 Z"
        fill={color}
      />
    </svg>
  );

  return (
    <div
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        position: 'fixed',
        inset: 0,
        background: 'var(--app-bg)',
      }}
    >
      {/* ── Scattered twinkling stars ─────────────────────────────────────── */}

      {/* Top-left */}
      <div className="sparkle sparkle-a" style={{ '--dur': '2.6s', position: 'absolute', top: '18%', left: '12%' } as React.CSSProperties}>
        <Star size={28} color="var(--app-text-strong)" />
      </div>

      {/* Top-right */}
      <div className="sparkle sparkle-c" style={{ '--dur': '3.1s', position: 'absolute', top: '22%', right: '14%' } as React.CSSProperties}>
        <Star size={20} color="var(--app-text-strong)" />
      </div>

      {/* Mid-left (below center) */}
      <div className="sparkle sparkle-b" style={{ '--dur': '2.0s', position: 'absolute', top: '58%', left: '8%' } as React.CSSProperties}>
        <Star size={16} color="var(--app-text-strong)" />
      </div>

      {/* Right side, near logo */}
      <div className="sparkle sparkle-a" style={{ '--dur': '3.5s', position: 'absolute', bottom: '22%', right: '10%' } as React.CSSProperties}>
        <Star size={22} color="var(--app-text-strong)" />
      </div>

      {/* Lottie animation — centred vertically */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <Lottie
          animationData={animationData}
          loop={false}
          style={{ width: 160, height: 160, filter: 'drop-shadow(0 6px 18px rgba(0, 0, 0, 0.18))' }}
        />
      </div>

      {/* Logo — just above the progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(10% + 8px + 28px)',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
      }}>
        <img
          className="load-logo"
          src={orbitLogo}
          alt="Orbit Market"
          style={{
            width: 200,
            objectFit: 'contain',
            opacity: 0.9,
          }}
        />
      </div>

    </div>
  );
}

/* ─── Top-right widget ────────────────────────────────────────────────── */

function TopRightWidget() {
  return (
    <div className="trw-root">
      {/* Balance */}
      <button className="trw-balance pt-[0px] pb-[0px] mt-[9px] mb-[9px] justify-start items-center flex-row gap-[11px]" onClick={() => hapticSelection()}>
        {/* Plus-circle */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="plus circle" className="trw-icon-blue">
          <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z" fill="currentColor"/>
        </svg>
        <span className="trw-balance-text">0</span>
        {/* Coin */}
        <span className="trw-icon-blue trw-coin">
          <DiamondIcon />
        </span>
      </button>
    </div>
  );
}

/* ─── Nav bar ─────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  {
    label: 'Маркет',
    icon: <LogoNavbar style={{ width: 55, height: 55, display: 'block', flexShrink: 0 }} />,
  },
  {
    label: 'Мои подарки',
    icon: <Lottie animationData={myGiftData} loop={false} autoplay={false} style={{ width: 38, height: 38 }} />,
  },
  {
    label: 'Профиль',
    icon: <Lottie animationData={profileData} loop={false} autoplay={false} style={{ width: 38, height: 38 }} />,
  },
];

function NavBar({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <nav className="nav-bar-wrapper text-left flex-row justify-between items-start border-t-[0px] border-r-[0px] border-b-[0px] border-l-[0px] ml-[0px] mr-[0px] gap-[0px]">
      {/* sliding capsule */}
      <div
        className="nav-capsule"
        style={{ transform: `translateX(calc(${active} * 100%))` }}
      />
      {NAV_ITEMS.map((item, i) => (
        <button
          key={i}
          className={`nav-item${active === i ? ' active' : ''}`}
          onClick={() => { hapticSelection(); onSelect(i); }}
          style={{ border: 'none', background: 'none', position: 'relative', zIndex: 1 }}
        >
          <span className="nav-icon-wrap">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ─── Market search & filter block ───────────────────────────────────── */

const FILTER_CHIPS = ['Коллекция', 'Модель', 'Тип'];

function MarketSearchBar() {
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

import { MarketPage } from './pages/MarketPage';
import { GiftsPage } from './pages/GiftsPage';
import { ProfilePage } from './pages/ProfilePage';

function MainScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [headerShown, setHeaderShown] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="main-screen">
      {/* Logo header */}
      <div className={`main-header${headerShown ? ' is-visible' : ''}`}>
        <button
          type="button"
          className="brand-pill"
          onClick={() => {
            hapticSelection();
            openBot();
          }}
        >
          <img className="brand-avatar" src={orbitAvatar} alt="Orbit Market" />
          <span className="brand-name">Orbit Market</span>
        </button>
      </div>

      {/* Page content */}
      <div
        className="main-content"
        onScroll={(e) => setHeaderShown(isHeaderRevealed(e.currentTarget.scrollTop))}
      >
        <TopRightWidget />
        {activeTab === 0 && <MarketPage />}
        {activeTab === 1 && <GiftsPage />}
        {activeTab === 2 && <ProfilePage />}
      </div>

      <div className="dock-scrim" aria-hidden="true" />
      <CartButton onOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
      <NavBar active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────── */

// 403-гейт: вход только из Telegram. Отключить на период разработки — GATE_ENABLED = false
// (тогда приложение открывается и в обычном браузере).
const GATE_ENABLED: boolean = true;

export default function App() {
  const inTelegram = isInTelegram();
  useTelegramSetup();
  useTelegramTheme();
  useTelegramInsets();
  const [loaded, setLoaded] = useState(false);

  if (GATE_ENABLED && !inTelegram) return <BrowserGate />;

  return loaded
    ? (
        <CartProvider>
          <MainScreen />
        </CartProvider>
      )
    : <LoadingScreen onDone={() => setLoaded(true)} />;
}
