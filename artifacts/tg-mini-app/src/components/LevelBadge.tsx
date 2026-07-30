import { levelBadge } from '../lib/levelBadge';
import { LEVEL_ASSETS } from '../lib/levelAssets';
import { EmojiLottie } from './EmojiLottie';

/**
 * Значок уровня: 1..9 — точный эмодзи; 10+ — форма десятка с дорисованным числом
 * (белая «заплатка» скрывает вшитое число, поверх — реальное). Возвращает null,
 * если уровня нет/он невалиден.
 */
export function LevelBadge({ level, size = 22 }: { level: number; size?: number }) {
  const info = levelBadge(level);
  if (!info) return null;
  const data = LEVEL_ASSETS[info.key];
  if (!data) return null;

  return (
    <span className="tg-badge" style={{ width: size, height: size }}>
      <EmojiLottie data={data} size={size} />
      {info.draw && (
        <>
          <span
            className="tg-badge__patch"
            style={{ width: size * 0.62, height: size * 0.5, borderRadius: size * 0.22 }}
          />
          <span
            className="tg-badge__num"
            style={{ fontSize: size * (info.draw.length >= 3 ? 0.32 : 0.44) }}
          >
            {info.draw}
          </span>
        </>
      )}
    </span>
  );
}
