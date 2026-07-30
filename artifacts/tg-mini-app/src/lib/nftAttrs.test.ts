import { describe, it, expect } from 'vitest';
import { giftSlug, parseNftAttributes } from './nftAttrs';

// Реальный фрагмент таблицы со страницы t.me/nft/PlushPepe-1.
const TABLE = `<div class="tgme_gift_table_wrap">
  <table class="table tgme_gift_table">
    <tbody>
<tr><th>Owner</th><td><i class="tgme_gift_owner_photo"></i><span dir="auto">Pavel Durov</span></td></tr>
<tr><th>Model</th><td>Pumpkin <mark>3%</mark></td></tr>
<tr><th>Backdrop</th><td>Onyx Black <mark>2%</mark></td></tr>
<tr><th>Symbol</th><td>Illuminati <mark>0.5%</mark></td></tr>
<tr><th>Quantity</th><td>2 825/2 861 issued</td></tr>
    </tbody>
  </table>
</div>`;

describe('giftSlug', () => {
  it('склеивает коллекцию и номер', () => {
    expect(giftSlug('SpringBasket', 45336)).toBe('SpringBasket-45336');
    expect(giftSlug('PlushPepe', 1)).toBe('PlushPepe-1');
  });
});

describe('parseNftAttributes', () => {
  it('парсит model/backdrop/symbol с редкостью', () => {
    const a = parseNftAttributes(TABLE);
    expect(a.model).toEqual({ name: 'Pumpkin', rarity: '3%' });
    expect(a.backdrop).toEqual({ name: 'Onyx Black', rarity: '2%' });
    expect(a.symbol).toEqual({ name: 'Illuminati', rarity: '0.5%' });
  });
  it('парсит quantity', () => {
    expect(parseNftAttributes(TABLE).quantity).toBe('2 825/2 861 issued');
  });
  it('имя без mark — редкость null', () => {
    const a = parseNftAttributes('<tr><th>Model</th><td>Just Name</td></tr>');
    expect(a.model).toEqual({ name: 'Just Name', rarity: null });
  });
  it('отсутствующие строки → null', () => {
    const a = parseNftAttributes('<table></table>');
    expect(a.model).toBeNull();
    expect(a.backdrop).toBeNull();
    expect(a.symbol).toBeNull();
    expect(a.quantity).toBeNull();
  });
  it('терпит пробелы/переносы в разметке', () => {
    const html = '<tr>\n  <th> Model </th>\n  <td> Neon Fox <mark>1.5%</mark> </td>\n</tr>';
    expect(parseNftAttributes(html).model).toEqual({ name: 'Neon Fox', rarity: '1.5%' });
  });
});
