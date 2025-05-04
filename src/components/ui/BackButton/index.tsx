'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './BackButton.module.css';

type BackButtonProps = {
  children: React.ReactNode;
};

export default function BackButton({ children }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
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
