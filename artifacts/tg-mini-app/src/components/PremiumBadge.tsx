import premium from '../assets/emoji/premium.json';
import { EmojiLottie } from './EmojiLottie';

/** Премиум-значок (звезда) рядом с ником. Рисуется вызывающим только при is_premium. */
export function PremiumBadge({ size = 24 }: { size?: number }) {
  return (
    <span className="tg-badge" style={{ width: size, height: size }}>
      <EmojiLottie data={premium} size={size} />
    </span>
  );
}
