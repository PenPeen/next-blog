// 日本語の黙読速度の目安（1分あたりの文字数）
const CHARS_PER_MINUTE = 500;

export function calculateReadingMinutes(text: string): number {
  const count = [...text.replace(/\s/g, "")].length;
  return Math.max(1, Math.ceil(count / CHARS_PER_MINUTE));
}
