'use client';

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { FlashType } from '@/actions/flash';

type FlashMessageClientProps = {
  type: FlashType;
  message: string;
};

export default function FlashMessageClient({ type, message }: FlashMessageClientProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`${styles.flashMessage} ${styles[type]}`}>
      <p className={styles.messageText}>{message}</p>
      <button
        className={styles.closeButton}
        onClick={() => setIsVisible(false)}
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
}
