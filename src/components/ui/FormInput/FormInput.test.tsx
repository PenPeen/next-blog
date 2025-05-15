import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '.';

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useFormContext: jest.fn(() => ({
      register: jest.fn(() => ({
        onBlur: jest.fn(),
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

describe('FormInput', () => {
  it('初期状態で正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <FormInput name="username" label="ユーザー名" placeholder="名前を入力" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('名前を入力')).toBeInTheDocument();
  });

  it('必須フィールドのマークが表示されること', () => {
    render(
      <TestWrapper>
        <FormInput name="email" label="メールアドレス" required={true} />
      </TestWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('ヘルプテキストが表示されること', () => {
    const helpText = 'ユーザー名を入力してください';
    render(
      <TestWrapper>
        <FormInput name="username" label="ユーザー名" helpText={helpText} />
      </TestWrapper>
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('フォーカス状態のクラス管理が適切にされること', async () => {
    render(
      <TestWrapper>
        <FormInput name="username" label="ユーザー名" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('ユーザー名');
    const user = userEvent.setup();

    await user.click(input);
    expect(input.className).toContain('fieldInputFocused');

    await user.tab();
    expect(input.className).not.toContain('fieldInputFocused');
  });

  it('エラー状態のときエラーメッセージが表示されること', () => {
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      ...useFormContext(),
      formState: {
        errors: {
          email: {
            message: 'メールアドレスを入力してください'
          }
        }
      }
    });

    render(<FormInput name="email" label="メールアドレス" />);
    expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('fieldInputError');
  });
});
