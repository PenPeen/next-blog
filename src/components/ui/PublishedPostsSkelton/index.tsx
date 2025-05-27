import styles from './PublishedPostsSkelton.module.css';

export default function PublishedPostsSkelton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonDescription}></div>
      </div>
    </div>
  );
};
