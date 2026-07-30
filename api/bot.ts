// Telegram webhook для @OrbitMrktBot — приветствие по /start с кнопкой Open.
// Serverless-функция Vercel. Секреты BOT_TOKEN / BOT_WEBHOOK_SECRET — из env (в коде их нет).

const TOKEN = process.env.BOT_TOKEN || '';

const WELCOME_HTML =
  '<blockquote><b>Orbit Market — Your coolest NFT Market in Telegram!</b></blockquote>\n' +
  '<i>To open Market click on the button below </i>' +
  '<tg-emoji emoji-id="5470177992950946662">👇</tg-emoji>';

// Фолбэк: кастом-эмодзи боту доступны только при наличии Fragment-юзернейма.
const WELCOME_PLAIN =
  '<blockquote><b>Orbit Market — Your coolest NFT Market in Telegram!</b></blockquote>\n' +
  '<i>To open Market click on the button below </i>👇';

const KEYBOARD = {
  inline_keyboard: [[{ text: 'Open', url: 'https://t.me/OrbitMrktBot/app' }]],
};

async function tg(method: string, body: unknown): Promise<{ ok?: boolean }> {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await r.json()) as { ok?: boolean };
}

async function sendWelcome(chatId: number): Promise<void> {
  const base = {
    chat_id: chatId,
    parse_mode: 'HTML',
    reply_markup: KEYBOARD,
    link_preview_options: { is_disabled: true },
  };
  const res = await tg('sendMessage', { ...base, text: WELCOME_HTML });
  if (res.ok !== true) {
    await tg('sendMessage', { ...base, text: WELCOME_PLAIN });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(200).send('ok');
    return;
  }
  const secret = process.env.BOT_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    res.status(401).send('unauthorized');
    return;
  }
  try {
    const update = req.body || {};
    const msg = update.message || update.edited_message;
    const text: unknown = msg?.text;
    if (
      msg?.chat?.id &&
      typeof text === 'string' &&
      text.split(/\s+/)[0].startsWith('/start')
    ) {
      await sendWelcome(msg.chat.id);
    }
  } catch {
    // Не валим вебхук на ошибке обработки.
  }
  res.status(200).send('ok');
}
