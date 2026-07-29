import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './assets/animation.json';
import orbitLogo from './assets/orbit-market-logo.svg';
import LogoNavbar from './assets/logo-navbar.svg?react';
import myGiftData from './assets/my-gift-icon.json';
import profileData from './assets/profile-icon.json';
import { isInTelegram } from './lib/telegram';
import BrowserGate from './components/BrowserGate';

/* ─── Telegram setup ──────────────────────────────────────────────────── */

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  requestFullscreen?(): void;
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
        backgroundColor: 'rgba(255,255,255,0.08)',
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
  const Star = ({ size, color = 'white' }: { size: number; color?: string }) => (
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
        background: 'hsl(220, 13%, 13%)',
      }}
    >
      {/* ── Scattered twinkling stars ─────────────────────────────────────── */}

      {/* Top-left */}
      <div className="sparkle sparkle-a" style={{ '--dur': '2.6s', position: 'absolute', top: '18%', left: '12%' } as React.CSSProperties}>
        <Star size={28} color="white" />
      </div>

      {/* Top-right */}
      <div className="sparkle sparkle-c" style={{ '--dur': '3.1s', position: 'absolute', top: '22%', right: '14%' } as React.CSSProperties}>
        <Star size={20} color="white" />
      </div>

      {/* Mid-left (below center) */}
      <div className="sparkle sparkle-b" style={{ '--dur': '2.0s', position: 'absolute', top: '58%', left: '8%' } as React.CSSProperties}>
        <Star size={16} color="white" />
      </div>

      {/* Right side, near logo */}
      <div className="sparkle sparkle-a" style={{ '--dur': '3.5s', position: 'absolute', bottom: '22%', right: '10%' } as React.CSSProperties}>
        <Star size={22} color="white" />
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
          speed={0.6}
          style={{ width: 160, height: 160 }}
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
          src={orbitLogo}
          alt="Orbit Market"
          style={{
            width: 200,
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
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
      <button className="trw-balance pt-[0px] pb-[0px] mt-[9px] mb-[9px] justify-start items-center flex-row gap-[11px]" onClick={() => {}}>
        {/* Plus-circle */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="plus circle" className="trw-icon-blue">
          <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z" fill="currentColor"/>
        </svg>
        <span className="trw-balance-text">0</span>
        {/* Coin */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="coin" className="trw-icon-blue">
          <path d="M15.4243 3.56177C16.3365 3.56177 16.793 3.56312 17.2055 3.69066C17.5705 3.80358 17.9092 3.98869 18.2017 4.23474C18.5319 4.51273 18.7784 4.896 19.2714 5.66276L21.4494 9.04949C21.7753 9.55644 21.9375 9.81061 21.9817 10.0774C22.0206 10.3125 21.9961 10.554 21.9082 10.7755C21.8082 11.0268 21.5943 11.24 21.1681 11.6661L13.0789 19.7554C12.7015 20.1328 12.5113 20.3226 12.2937 20.3932C12.1028 20.4551 11.897 20.4551 11.7061 20.3932C11.4885 20.3226 11.3 20.1327 10.9226 19.7554L2.83166 11.6661C2.40569 11.2402 2.19331 11.0266 2.09336 10.7755C2.0053 10.554 1.97909 10.3126 2.01804 10.0774C2.06227 9.81061 2.22451 9.55644 2.55041 9.04949L4.72841 5.66276C5.2213 4.89605 5.46802 4.51273 5.79818 4.23474C6.09044 3.98874 6.42929 3.80358 6.79426 3.69066C7.2068 3.56312 7.66335 3.56177 8.57551 3.56177H15.4243ZM14.7764 6.23364C14.665 5.93352 14.2401 5.93367 14.1285 6.23364L13.3584 8.31288C13.3122 8.43721 13.2149 8.53621 13.0906 8.58241L11.0113 9.35082C10.7109 9.4622 10.7109 9.88731 11.0113 9.99871L13.0906 10.7671C13.2149 10.8133 13.3122 10.9123 13.3584 11.0367L14.1285 13.1159C14.2402 13.4158 14.665 13.4159 14.7764 13.1159L15.5448 11.0367C15.591 10.912 15.6896 10.8132 15.8144 10.7671L17.8919 9.99871C18.1926 9.88741 18.1926 9.4621 17.8919 9.35082L15.8144 8.58241C15.6897 8.53625 15.591 8.43752 15.5448 8.31288L14.7764 6.23364Z" fill="currentColor"/>
        </svg>
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
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

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
            readOnly
          />
        </div>
      </div>

      {/* Row 2: filter chips + action buttons */}
      <div className="msb-row2">
        {FILTER_CHIPS.map((label, i) => (
          <button
            key={i}
            className={`msb-chip${activeFilter === i ? ' msb-chip-active' : ''}`}
            onClick={() => setActiveFilter(activeFilter === i ? null : i)}
          >
            <span>{label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="msb-chip-arrow">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}

        <div className="msb-actions">
          {/* Sort */}
          <button className="msb-action-btn" onClick={() => {}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6 12H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M10 18H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Price/sort toggle */}
          <button className="msb-action-btn" onClick={() => {}}>
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

/* ─── Main screen ─────────────────────────────────────────────────────── */

function MainScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="main-screen">
      <TopRightWidget />

      {/* Logo header */}
      <div className="main-header">
        <img
          src={orbitLogo}
          alt="Orbit Market"
          className="main-logo"
        />
      </div>

      {/* Page content */}
      <div className="main-content">
        {activeTab === 0 && <MarketSearchBar />}
      </div>

      <NavBar active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────── */

export default function App() {
  const inTelegram = isInTelegram();
  useTelegramSetup();
  const [loaded, setLoaded] = useState(false);

  if (!inTelegram) return <BrowserGate />;

  return loaded
    ? <MainScreen />
    : <LoadingScreen onDone={() => setLoaded(true)} />;
}
