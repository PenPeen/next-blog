import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  it('初期状態はデフォルトでfalse', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('初期状態を指定して初期化できる', () => {
    const { result } = renderHook(() => useModal(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('openModalでモーダルを開く', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closeModalでモーダルを閉じる', () => {
    const { result } = renderHook(() => useModal(true));

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('toggleModalでモーダルの状態を切り替える', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
