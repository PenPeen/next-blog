import React from 'react'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>ページが見つかりません</h2>
        <p className={styles.message}>
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/" className={styles.homeLink}>
          ホームページに戻る
        </Link>
      </div>
    </div>
  )
}
