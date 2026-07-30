// Прокси Lottie-карточки подарка с fragment.com (у fragment закрыт CORS).
// Возвращает полный Lottie (слои Gift+Pattern+Background) для слага.

declare function fetch(
  url: string,
  init?: { headers?: Record<string, string> },
): Promise<{ json(): Promise<unknown>; status: number }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  const slug = String(req.query?.slug ?? '');
  if (!/^[A-Za-z0-9]+-\d+$/.test(slug)) {
    res.status(400).json({ error: 'bad_slug' });
    return;
  }
  try {
    const r = await fetch(`https://nft.fragment.com/gift/${slug}.lottie.json`, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; OrbitMarket/1.0)' },
    });
    if (r.status !== 200) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    const data = await r.json();
    res.setHeader('cache-control', 'public, max-age=86400');
    res.status(200).json(data);
  } catch {
    res.status(502).json({ error: 'fetch_failed' });
  }
}
