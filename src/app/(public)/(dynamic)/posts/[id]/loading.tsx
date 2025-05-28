import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.metaSkeleton}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.paragraphSkeleton}></div>
        <div className={styles.paragraphSkeleton}></div>
        <div className={styles.paragraphSkeleton}></div>
        <div className={styles.imageSkeleton}></div>
        <div className={styles.paragraphSkeleton}></div>
        <div className={styles.paragraphSkeleton}></div>
      </div>
    </div>
  );
}
