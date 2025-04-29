'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('アプリケーションエラー:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>Error</h1>
        <p className={styles.errorMessage}>
          予期せぬエラーが発生しました。
        </p>
        {error.digest && (
          <p className={styles.errorCode}>
            エラーコード: <code>{error.digest}</code>
          </p>
        )}
        <button
          className={styles.resetButton}
          onClick={() => reset()}
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
