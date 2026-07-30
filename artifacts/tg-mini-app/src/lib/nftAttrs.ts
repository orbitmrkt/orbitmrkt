export interface NftAttr {
  name: string;
  /** Редкость как строка с исходной страницы, напр. "3%" (или null). */
  rarity: string | null;
}

export interface NftAttributes {
  model: NftAttr | null;
  backdrop: NftAttr | null;
  symbol: NftAttr | null;
  quantity: string | null;
}

/** Слаг NFT-инстанса из коллекции и номера: `SpringBasket-45336`. */
export function giftSlug(collection: string, number: number): string {
  return `${collection}-${number}`;
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Парсит одну строку таблицы `<tr><th>KEY</th><td>Name <mark>Rarity</mark></td></tr>`. */
function parseRow(html: string, key: string): NftAttr | null {
  const re = new RegExp(
    `<tr>\\s*<th>\\s*${key}\\s*</th>\\s*<td>([\\s\\S]*?)</td>`,
    'i',
  );
  const m = re.exec(html);
  if (!m) return null;
  const cell = m[1];
  const markM = /<mark>([\s\S]*?)<\/mark>/i.exec(cell);
  const rarity = markM ? stripTags(markM[1]) : null;
  const name = stripTags(cell.replace(/<mark>[\s\S]*?<\/mark>/i, ''));
  if (!name) return null;
  return { name, rarity };
}

/**
 * Парсит атрибуты NFT из HTML таблицы `tgme_gift_table` (со страницы t.me/nft/<slug>).
 * Возвращает model/backdrop/symbol (имя + редкость) и quantity, отсутствующие — null.
 */
export function parseNftAttributes(html: string): NftAttributes {
  const qM = /<tr>\s*<th>\s*Quantity\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i.exec(html);
  return {
    model: parseRow(html, 'Model'),
    backdrop: parseRow(html, 'Backdrop'),
    symbol: parseRow(html, 'Symbol'),
    quantity: qM ? stripTags(qM[1]) : null,
  };
}
