"use client";

import { useState, useRef, useEffect, ReactNode } from 'react';
import styles from './Tooltip.module.css';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  disabled?: boolean;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div className={styles.tooltipContainer}>
      <div
        className={styles.tooltipTrigger}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>

      {isVisible && !disabled && (
        <div
          className={`${styles.tooltip} ${styles[`tooltip__${position}`]}`}
          role="tooltip"
        >
          <div className={styles.tooltipContent}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
