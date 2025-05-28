import PublishedPostsSkelton from '@/components/ui/PublishedPostsSkelton';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div>
      <div className={styles.cardContainer}>
        {Array(9).fill(0).map((_, index) => (
          <PublishedPostsSkelton key={index} />
        ))}
      </div>
    </div>
  );
}
