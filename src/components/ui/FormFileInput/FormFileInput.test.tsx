import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from 'react-hook-form';
import FormFileInput from '.';


const registerMock = jest.fn(() => ({
  onBlur: jest.fn(),
  onChange: jest.fn(),
  ref: jest.fn(),
  name: 'test'
}));


const registerMockWithoutOnChange = jest.fn(() => ({
  onBlur: jest.fn(),
  ref: jest.fn(),
  name: 'test',

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
    return <img {...props} />;
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FormFileInput', () => {
  beforeEach(() => {

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


    expect(() => {
      fireEvent.change(fileInput);
    }).not.toThrow();


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

    expect(fileInput.closest('.fileInputWrapper')).toHaveClass('fileInputWrapperFocused');

    fireEvent.blur(fileInput);

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

    expect(fileInput.closest('.dropzone')).toHaveClass('dropzoneFocused');
  });
});
