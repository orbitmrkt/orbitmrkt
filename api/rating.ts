// Возвращает Telegram-рейтинг (StarsRating) пользователя Mini App.
// Вход: { initData } (подписанная строка). Проверяем подпись по BOT_TOKEN (HMAC),
// затем getChat(user_id) → ChatFullInfo.rating. Секрет BOT_TOKEN — из env.

// Амбиентные рантайм-глобалы (без @types/node), как в api/bot.ts:
declare const process: { env: Record<string, string | undefined> };
declare function fetch(
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
): Promise<{ json(): Promise<unknown> }>;
declare class TextEncoder {
  encode(input: string): Uint8Array;
}
interface SubtleKey {
  readonly _k?: never;
}
declare const crypto: {
  subtle: {
    importKey(
      format: 'raw',
      keyData: Uint8Array,
      algorithm: { name: string; hash: string },
      extractable: boolean,
      keyUsages: string[],
    ): Promise<SubtleKey>;
    sign(algorithm: string, key: SubtleKey, data: Uint8Array): Promise<ArrayBuffer>;
  };
};

const MAX_AGE_SEC = 86400; // initData не старше суток

function parseQuery(q: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of q.split('&')) {
    if (!part) continue;
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[decodeURIComponent(part.slice(0, i))] = decodeURIComponent(part.slice(i + 1));
  }
  return out;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(keyBytes: Uint8Array, msg: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return new Uint8Array(sig);
}

/** Проверяет подпись initData; при успехе возвращает разобранные поля, иначе null. */
async function validateInitData(
  initData: string,
  token: string,
): Promise<Record<string, string> | null> {
  const data = parseQuery(initData);
  const hash = data.hash;
  if (!hash) return null;
  delete data.hash;
  const dcs = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join('\n');
  const enc = new TextEncoder();
  const secret = await hmac(enc.encode('WebAppData'), token);
  const calc = toHex(await hmac(secret, dcs));
  return calc === hash ? data : null;
}

interface RawRating {
  level?: number;
  rating?: number;
  current_level_rating?: number;
  next_level_rating?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  const token = process.env.BOT_TOKEN || '';
  const initData: unknown = req.body?.initData;
  if (!token || typeof initData !== 'string' || !initData) {
    res.status(400).json({ error: 'bad_request' });
    return;
  }

  const data = await validateInitData(initData, token);
  if (!data) {
    res.status(401).json({ error: 'invalid_init_data' });
    return;
  }
  const authDate = Number(data.auth_date || 0);
  if (authDate && Date.now() / 1000 - authDate > MAX_AGE_SEC) {
    res.status(401).json({ error: 'stale_init_data' });
    return;
  }

  let userId: number | undefined;
  try {
    userId = (JSON.parse(data.user || '{}') as { id?: number }).id;
  } catch {
    userId = undefined;
  }
  if (!userId) {
    res.status(400).json({ error: 'no_user' });
    return;
  }

  try {
    const r = await fetch(
      `https://api.telegram.org/bot${token}/getChat?chat_id=${userId}`,
    );
    const j = (await r.json()) as { result?: { rating?: RawRating } };
    const rt = j.result?.rating;
    if (rt && typeof rt.level === 'number') {
      res.status(200).json({
        level: rt.level,
        rating: typeof rt.rating === 'number' ? rt.rating : null,
        currentLevelRating:
          typeof rt.current_level_rating === 'number' ? rt.current_level_rating : null,
        nextLevelRating:
          typeof rt.next_level_rating === 'number' ? rt.next_level_rating : null,
      });
      return;
    }
    res.status(200).json({ level: null });
  } catch {
    res.status(200).json({ level: null });
  }
}
