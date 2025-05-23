"use client";

import { useReducer } from 'react';

type ModalState = {
  isOpen: boolean;
};

type ModalAction = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'TOGGLE' };

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN':
      return { isOpen: true };
    case 'CLOSE':
      return { isOpen: false };
    case 'TOGGLE':
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
};

export interface UseModalReturnType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState = false): UseModalReturnType => {
  const [state, dispatch] = useReducer(modalReducer, { isOpen: initialState });

  const openModal = () => dispatch({ type: 'OPEN' });
  const closeModal = () => dispatch({ type: 'CLOSE' });
  const toggleModal = () => dispatch({ type: 'TOGGLE' });

  return {
    isOpen: state.isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModal;
