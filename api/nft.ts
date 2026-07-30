// Прокси для страницы NFT-инстанса t.me/nft/<slug>: обходит CORS Telegram.
// Возвращает {table, ogImage} — фрагмент таблицы атрибутов и статичное превью.
// Никаких секретов; changes.tg тут не используется (кредит не требуется на этом слое).

declare function fetch(
  url: string,
  init?: { headers?: Record<string, string> },
): Promise<{ text(): Promise<string>; status: number }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  const slug = String(req.query?.slug ?? '');
  // Разрешаем только формат Collection-Number — защита от SSRF.
  if (!/^[A-Za-z0-9]+-\d+$/.test(slug)) {
    res.status(400).json({ error: 'bad_slug' });
    return;
  }
  try {
    const r = await fetch(`https://t.me/nft/${slug}`, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; OrbitMarket/1.0)' },
    });
    const html = await r.text();
    const tableM = /tgme_gift_table[\s\S]*?<\/table>/i.exec(html);
    const ogM = /<meta property="og:image" content="([^"]+)"/i.exec(html);
    const ogT = /<meta property="og:title" content="([^"]+)"/i.exec(html);
    res.setHeader('cache-control', 'public, max-age=300');
    res.status(200).json({
      ok: true,
      table: tableM ? tableM[0] : '',
      ogImage: ogM ? ogM[1] : null,
      ogTitle: ogT ? ogT[1] : null,
    });
  } catch {
    res.status(502).json({ error: 'fetch_failed' });
  }
}
