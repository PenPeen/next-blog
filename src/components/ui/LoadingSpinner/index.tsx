import React from 'react';
import styles from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer} role="status">
      <div className={styles.spinner}></div>
      <span className={styles.visuallyHidden}>読み込み中</span>
    </div>
  );
}

export default LoadingSpinner;
