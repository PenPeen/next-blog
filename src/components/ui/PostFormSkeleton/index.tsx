'use client';

import React from 'react';
import styles from './PostFormSkeleton.module.css';

export default function PostFormSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.skeletonBox} style={{ height: '20px', width: '80px' }} />
          <div className={styles.skeletonBox} style={{ height: '40px', marginTop: '5px' }} />
        </div>
        <div className={styles.statusContainer}>
          <div className={styles.skeletonBox} style={{ height: '20px', width: '60px' }} />
          <div className={styles.skeletonBox} style={{ height: '40px', width: '150px', marginTop: '5px' }} />
        </div>
      </div>

      <div className={styles.thumbnailContainer}>
        <div className={styles.skeletonBox} style={{ height: '20px', width: '100px' }} />
        <div className={styles.skeletonBox} style={{ height: '150px', marginTop: '5px' }} />
      </div>

      <div className={styles.content}>
        <div className={styles.skeletonBox} style={{ height: '20px', width: '80px' }} />
        <div className={styles.skeletonBox} style={{ height: '200px', marginTop: '5px' }} />
      </div>

      <div className={styles.actions}>
        <div className={styles.skeletonBox} style={{ height: '40px', width: '120px' }} />
      </div>
    </div>
  );
}
