import React from 'react';
import styles from './loading.module.css';

export function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Loading;
