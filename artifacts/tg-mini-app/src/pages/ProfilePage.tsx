import { getTelegramUser } from '../lib/telegram';
import { useTgRating } from '../lib/useTgRating';
import { PremiumBadge } from '../components/PremiumBadge';
import { LevelBadge } from '../components/LevelBadge';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const s = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  return s.toUpperCase() || '?';
}

export function ProfilePage() {
  const user = getTelegramUser();
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Пользователь';
  const username = user?.username;
  // Уровень из Telegram-рейтинга (StarsRating) через /api/rating. Нет рейтинга — значок скрыт.
  const rating = useTgRating();
  const level: number | null = rating?.level ?? null;

  return (
    <div className="profile-page">
      <div className="profile-head">
        <div className="profile-avatar">
          {user?.photoUrl ? (
            <img className="profile-avatar__img" src={user.photoUrl} alt={name} />
          ) : (
            <span className="profile-avatar__ini">{initials(name)}</span>
          )}
        </div>
        <div className="profile-name">
          <span>{name}</span>
          {user?.isPremium && <PremiumBadge size={24} />}
        </div>
        <div className="profile-user">
          {level != null && <LevelBadge level={level} size={22} />}
          {username && <span>@{username}</span>}
        </div>
      </div>
    </div>
  );
}
