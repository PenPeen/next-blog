"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div className={`${styles.modal} ${styles[size]}`} role="dialog" aria-modal={isOpen}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="閉じる"
              type="button"
            >
              ×
            </button>
          </div>
        )}
        {!title && (
          <button
            className={styles.closeButtonNoTitle}
            onClick={onClose}
            aria-label="閉じる"
            type="button"
          >
            ×
          </button>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
