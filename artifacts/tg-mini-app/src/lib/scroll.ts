/** Порог прокрутки (px), после которого показывается фростед-header. */
export const HEADER_REVEAL_THRESHOLD = 96;

/**
 * true, когда контент прокручен достаточно, чтобы показать header.
 * Отрицательный scrollTop (overscroll-баунс на мобилках) трактуется как «вверху».
 */
export function isHeaderRevealed(scrollTop: number): boolean {
  return scrollTop > HEADER_REVEAL_THRESHOLD;
}
