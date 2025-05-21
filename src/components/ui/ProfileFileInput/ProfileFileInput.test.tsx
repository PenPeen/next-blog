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

  it('プレビューURLがない場合はデフォルト画像が表示されること', () => {
    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const img = screen.getByAltText('プロフィール画像');
    expect(img).toBeVisible();
    expect(img.getAttribute('src')).toContain('user.gif');
  });

  it('required が true の場合、必須マークが表示されること', () => {
    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" required={true} />
      </TestWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
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

  it('画像以外のファイルが選択された場合はプレビューが更新されないこと', async () => {
    // FileReaderのモック設定
    const originalFileReader = window.FileReader;
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
      result: null,
    };
    const mockFileReaderCtor = jest.fn(() => mockFileReader);
    window.FileReader = mockFileReaderCtor as unknown as typeof FileReader;

    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    // テキストファイルを選択
    const textFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('プロフィール画像');

    // ファイルをアップロード
    Object.defineProperty(input, 'files', {
      value: [textFile]
    });
    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    // FileReaderのreadAsDataURLが呼ばれていないことを確認
    expect(mockFileReader.readAsDataURL).not.toHaveBeenCalled();

    // 元の実装に戻す
    window.FileReader = originalFileReader;
  });

  it('registerOnChangeが存在しない場合でも画像選択が正しく機能すること', async () => {
    // registerOnChangeを持たないモック
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      register: jest.fn(() => ({
        onBlur: jest.fn(),
        ref: jest.fn(),
        name: 'test'
        // onChangeはここでは設定しない
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

    // FileReader のモック
    const originalReadAsDataURL = FileReader.prototype.readAsDataURL;
    const mockReadAsDataURL = jest.fn();
    FileReader.prototype.readAsDataURL = mockReadAsDataURL;

    // テスト
    Object.defineProperty(input, 'files', {
      value: [file]
    });

    const event = new Event('change', { bubbles: true });
    // エラーなく実行されることを確認
    expect(() => {
      input.dispatchEvent(event);
    }).not.toThrow();

    expect(mockReadAsDataURL).toHaveBeenCalledWith(file);

    // 元の実装に戻す
    FileReader.prototype.readAsDataURL = originalReadAsDataURL;
  });

  it('プレビューURLが変更された場合、プレビュー画像が更新されること', () => {
    const { rerender } = render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" previewUrl="/initial-image.jpg" />
      </TestWrapper>
    );

    const initialImg = screen.getByAltText('プロフィール画像');
    expect(initialImg.getAttribute('src')).toContain('initial-image.jpg');

    // previewUrlを変更して再レンダリング
    rerender(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" previewUrl="/updated-image.jpg" />
      </TestWrapper>
    );

    const updatedImg = screen.getByAltText('プロフィール画像');
    expect(updatedImg.getAttribute('src')).toContain('updated-image.jpg');
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

  it('ファイル選択がキャンセルされ、プレビューURLが設定されている場合はプレビューURLが保持されること', async () => {
    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" previewUrl="/test-image.jpg" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('プロフィール画像');
    Object.defineProperty(input, 'files', {
      value: []
    });

    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    const img = screen.getByAltText('プロフィール画像');
    expect(img.getAttribute('src')).toContain('test-image.jpg');
  });

  it('acceptプロパティが正しく設定されること', () => {
    render(
      <TestWrapper>
        <ProfileFileInput name="avatar" label="プロフィール画像" accept=".jpg,.png" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('プロフィール画像');
    expect(input).toHaveAttribute('accept', '.jpg,.png');
  });
});
