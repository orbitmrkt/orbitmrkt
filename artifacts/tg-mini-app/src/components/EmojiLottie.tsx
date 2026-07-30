import Lottie from 'lottie-react';

/** Рендер одного Lottie-эмодзи заданного размера (проигрывается один раз). */
export function EmojiLottie({ data, size }: { data: unknown; size: number }) {
  return (
    <Lottie
      animationData={data as object}
      loop={false}
      style={{ width: size, height: size, display: 'block' }}
    />
  );
}
