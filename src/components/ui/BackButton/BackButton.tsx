'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './BackButton.module.css';

type BackButtonProps = {
  children: React.ReactNode;
  onBack?: () => void;
};

export default function BackButton({ children, onBack }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={styles.backButton}
    >
      {children}
    </button>
  );
}
