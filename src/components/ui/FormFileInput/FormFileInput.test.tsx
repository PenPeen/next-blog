import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from 'react-hook-form';
import FormFileInput from '.';

// モックの設定
const registerMock = jest.fn(() => ({
  onBlur: jest.fn(),
  onChange: jest.fn(),
  ref: jest.fn(),
  name: 'test'
}));

// registerOnChangeなしのモック
const registerMockWithoutOnChange = jest.fn(() => ({
  onBlur: jest.fn(),
  ref: jest.fn(),
  name: 'test',
  // TypeScriptエラーを避けるためundefinedとして定義
  onChange: undefined
}));

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useFormContext: jest.fn(() => ({
      register: registerMock,
      formState: {
        errors: {}
      }
    }))
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FormFileInput', () => {
  beforeEach(() => {
    // FSFileオブジェクトのモックリセット
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    jest.clearAllMocks();
  });

  it('初期状態で正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('プロフィール画像')).toBeInTheDocument();
    expect(screen.getByText('ファイルを選択')).toBeInTheDocument();
    expect(screen.getByText('参照')).toBeInTheDocument();
  });

  it('必須フィールドのマークが表示されること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" required={true} />
      </TestWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('ヘルプテキストが表示されること', () => {
    const helpText = '最大2MBまでのファイルをアップロード';
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" helpText={helpText} />
      </TestWrapper>
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('dropzoneバリアントが正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" variant="dropzone" />
      </TestWrapper>
    );

    expect(screen.getByText('クリックしてアップロード')).toBeInTheDocument();
    expect(screen.getByText('またはドラッグ＆ドロップ')).toBeInTheDocument();
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

    render(<FormFileInput name="avatar" label="プロフィール画像" />);
    expect(screen.getByText('ファイルを選択してください')).toBeInTheDocument();
  });

  it('ファイルが選択されたときにファイル名が表示されること（デフォルトバリアント）', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });

    fireEvent.change(fileInput);

    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('ファイルが選択されたときにファイル名が表示されること（dropzoneバリアント）', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" variant="dropzone" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });

    fireEvent.change(fileInput);

    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('ファイルが選択されないときにデフォルトテキストが表示されること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');

    Object.defineProperty(fileInput, 'files', {
      value: []
    });

    fireEvent.change(fileInput);

    expect(screen.getByText('ファイルを選択')).toBeInTheDocument();
  });

  it('registerOnChangeが存在しない場合でも正しく動作すること', () => {
    // registerにonChangeが含まれないようにモックを変更
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      register: registerMockWithoutOnChange,
      formState: {
        errors: {}
      }
    });

    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });

    // エラーなく変更イベントが処理されることを確認
    expect(() => {
      fireEvent.change(fileInput);
    }).not.toThrow();

    // ファイル名が表示されることを確認
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('参照ボタンをクリックするとファイル選択ダイアログが開くこと', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');
    const clickSpy = jest.spyOn(fileInput, 'click');

    fireEvent.click(screen.getByText('参照'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('dropzoneエリアをクリックするとファイル選択ダイアログが開くこと', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" variant="dropzone" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');
    const clickSpy = jest.spyOn(fileInput, 'click');

    // dropzoneエリアをクリック
    fireEvent.click(screen.getByText('クリックしてアップロード'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('フォーカス状態が正しく処理されること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');

    fireEvent.focus(fileInput);
    // フォーカス状態のクラスが追加されていることを確認（実装によるが、一般的なパターン）
    expect(fileInput.closest('.fileInputWrapper')).toHaveClass('fileInputWrapperFocused');

    fireEvent.blur(fileInput);
    // フォーカス状態のクラスが削除されていることを確認
    expect(fileInput.closest('.fileInputWrapper')).not.toHaveClass('fileInputWrapperFocused');
  });

  it('acceptプロパティが正しく設定されること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" accept=".jpg,.png" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');
    expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
  });

  it('dropzoneバリアントでエラー状態のクラスが適用されること', () => {
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

    render(<FormFileInput name="avatar" label="プロフィール画像" variant="dropzone" />);

    // エラークラスが適用されていることを確認
    expect(screen.getByText('クリックしてアップロード').closest('.dropzone')).toHaveClass('dropzoneError');
  });

  it('dropzoneバリアントでフォーカス状態のクラスが適用されること', () => {
    render(
      <TestWrapper>
        <FormFileInput name="avatar" label="プロフィール画像" variant="dropzone" />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText('プロフィール画像');

    fireEvent.focus(fileInput);
    // フォーカス状態のクラスが追加されていることを確認
    expect(fileInput.closest('.dropzone')).toHaveClass('dropzoneFocused');
  });
});
