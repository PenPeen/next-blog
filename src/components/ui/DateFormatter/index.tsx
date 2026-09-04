import styles from './FormattedDate.module.css'

type Props = {
  date: string;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
// これより古い投稿は相対表示にしても日付が掴めないため、絶対表示に戻す。
const RELATIVE_LIMIT_MS = 7 * DAY_MS;

function formatElapsed(elapsedMs: number) {
  if (elapsedMs < HOUR_MS) {
    return 'たった今';
  }
  if (elapsedMs < DAY_MS) {
    return `${Math.floor(elapsedMs / HOUR_MS)}時間前`;
  }
  return `${Math.floor(elapsedMs / DAY_MS)}日前`;
}

export default function FormattedDate({ date }: Props) {
  const target = new Date(date);
  const elapsedMs = Date.now() - target.getTime();

  const label = elapsedMs >= 0 && elapsedMs < RELATIVE_LIMIT_MS
    ? formatElapsed(elapsedMs)
    : target.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  return (
    <div className={styles.meta}>
      <time dateTime={target.toISOString()}>{label}</time>
    </div>
  )
}
