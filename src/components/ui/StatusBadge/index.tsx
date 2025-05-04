'use client';

import React from 'react';
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: 'draft' | 'published';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusText = (status: StatusBadgeProps['status']): string => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'published':
        return '公開中';
    }
  };

  return (
    <span className={`${styles.badge} ${styles[`badge__${status}`]}`}>
      {getStatusText(status)}
    </span>
  );
}
