import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import ProfileFileInput from '.';

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useFormContext: jest.fn(() => ({
      register: jest.fn(() => ({
        onBlur: jest.fn(),
        onChange: jest.fn(),
        ref: jest.fn(),
        name: 'test'
      })),
      formState: {
        errors: {}
      }
    }))
  };
});


const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ProfileFileInput', () => {
  it('初期状態', () => {
    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" helpText={'最大2MBまでのファイルをアップロード'} previewUrl="/test-image.jpg" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('プロフィール画像')).toBeInTheDocument();
    expect(screen.getByText('画像をアップロード')).toBeInTheDocument();
    expect(screen.getByAltText('プロフィール画像')).toBeInTheDocument();
    expect(screen.getByText('最大2MBまでのファイルをアップロード')).toBeInTheDocument();

    const img = screen.getByAltText('プロフィール画像');
    expect(img).toBeVisible();
    expect(img.getAttribute('src')).toContain('test-image.jpg');
  });

  it('エラー状態のときエラーメッセージが表示されること', () => {
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      ...useFormContext(),
      formState: {
        errors: {
          avatar: {
            message: 'ファイルを選択してください'
          }
        }
      }
    });

    render(<ProfileFileInput name="avatar" label="プロフィール画像" />);
    expect(screen.getByText('ファイルを選択してください')).toBeInTheDocument();
  });

  it('アップロードボタンをクリックするとファイル選択ダイアログが開くこと', async () => {
    const originalClick = HTMLInputElement.prototype.click;
    const mockClick = jest.fn();
    HTMLInputElement.prototype.click = mockClick;

    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('画像をアップロード'));

    expect(mockClick).toHaveBeenCalled();

    HTMLInputElement.prototype.click = originalClick;
  });

  it('画像ファイルが選択されたときプレビューが更新されること', async () => {
    const mockOnChange = jest.fn();
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      register: jest.fn(() => ({
        onBlur: jest.fn(),
        onChange: mockOnChange,
        ref: jest.fn(),
        name: 'test'
      })),
      formState: { errors: {} }
    });

    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('プロフィール画像');

    await userEvent.upload(input, file);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('画像でないファイルが選択された場合でもonChangeイベントは発火すること', async () => {
    const mockOnChange = jest.fn();
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      register: jest.fn(() => ({
        onBlur: jest.fn(),
        onChange: mockOnChange,
        ref: jest.fn(),
        name: 'test'
      })),
      formState: { errors: {} }
    });

    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('プロフィール画像');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('フォーカスとBlurイベントが正しく処理されること', async () => {
    const mockOnBlur = jest.fn();
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      register: jest.fn(() => ({
        onBlur: mockOnBlur,
        onChange: jest.fn(),
        ref: jest.fn(),
        name: 'test'
      })),
      formState: { errors: {} }
    });

    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('プロフィール画像');
    const user = userEvent.setup();
    await user.click(input);
    await user.tab();
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('ファイルが選択されなかった場合（キャンセル時）、プレビューがクリアされること', async () => {
    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('プロフィール画像');
    await userEvent.upload(input, []);
    const img = screen.getByAltText('プロフィール画像');
    expect(img.getAttribute('src')).toContain('user.gif');
  });
});
