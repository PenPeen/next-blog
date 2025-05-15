import React from 'react';
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from 'react-hook-form';
import FormFileInput from '.';

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
});
