import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from 'react-hook-form';
import FormCheckBox from '.';

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

describe('FormCheckBox', () => {
  it('初期状態で正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <FormCheckBox name="agreement" label="利用規約に同意する" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('利用規約に同意する')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('必須フィールドのマークが表示されること', () => {
    render(
      <TestWrapper>
        <FormCheckBox name="agreement" label="利用規約に同意する" required={true} />
      </TestWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('ヘルプテキストが表示されること', () => {
    const helpText = '利用規約をご確認ください';
    render(
      <TestWrapper>
        <FormCheckBox name="agreement" label="利用規約に同意する" helpText={helpText} />
      </TestWrapper>
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('デフォルトでチェックされた状態でレンダリングされること', () => {
    render(
      <TestWrapper>
        <FormCheckBox name="agreement" label="利用規約に同意する" defaultChecked={true} />
      </TestWrapper>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('フォーカス状態のクラス管理が適切にされること', async () => {
    render(
      <TestWrapper>
        <FormCheckBox name="agreement" label="利用規約に同意する" />
      </TestWrapper>
    );

    const checkbox = screen.getByLabelText('利用規約に同意する');
    const user = userEvent.setup();

    await user.click(checkbox);
    expect(checkbox.className).toContain('checkboxInputFocused');

    await user.tab();
    expect(checkbox.className).not.toContain('checkboxInputFocused');
  });

  it('エラー状態のときエラーメッセージが表示されること', () => {
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      ...useFormContext(),
      formState: {
        errors: {
          agreement: {
            message: '利用規約に同意してください'
          }
        }
      }
    });

    render(<FormCheckBox name="agreement" label="利用規約に同意する" />);
    expect(screen.getByText('利用規約に同意してください')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('checkboxInputError');
  });
});
