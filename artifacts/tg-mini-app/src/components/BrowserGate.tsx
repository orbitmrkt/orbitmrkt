import Lottie from 'lottie-react';
import orbitLogo from '../assets/orbit-market-logo.svg';
import tgIcon from '../assets/open-in-telegram.json';

const BOT_URL = 'https://t.me/Orbit_mrkt_bot/market';

export default function BrowserGate() {
  return (
    <div className="gate-root">
      <img className="gate-logo" src={orbitLogo} alt="Orbit Market" />

      <div className="gate-badge">Ошибка 403</div>

      <p className="gate-text">
        Увы, Orbit Market нельзя открыть в браузере, пожалуйста, откройте его
        в Telegram по кнопке ниже
      </p>

      <a
        className="gate-btn"
        href={BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="gate-btn-icon">
          <Lottie
            animationData={tgIcon}
            loop
            autoplay
            style={{ width: 28, height: 28 }}
          />
        </span>
        <span className="gate-btn-label">Открыть в Telegram</span>
      </a>
    </div>
  );
}
