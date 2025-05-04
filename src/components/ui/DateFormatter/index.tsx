import styles from './FormattedDate.module.css'

type Props = {
  date: string;
}

export default function FormattedDate({ date }: Props) {

  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.meta}>
      <time dateTime={formattedDate}>{formattedDate}</time>
    </div>
  )
}
