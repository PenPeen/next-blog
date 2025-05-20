import React from 'react';
import { render, screen } from "@testing-library/react";
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import FormDropdown from '.';

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

const mockOptions = [
  { value: 'option1', label: 'オプション1' },
  { value: 'option2', label: 'オプション2' },
  { value: 'option3', label: 'オプション3' }
];

describe('FormDropdown', () => {
  it('初期表示', () => {
    render(
      <TestWrapper>
        <FormDropdown
          name="testDropdown"
          label="テストドロップダウン"
          options={mockOptions}
        />
      </TestWrapper>
    );

    expect(screen.getByRole('combobox', { name: 'テストドロップダウン' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'オプション1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'オプション2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'オプション3' })).toBeInTheDocument();
  });

  it('エラーメッセージが表示される', () => {
    (useFormContext as jest.Mock).mockImplementation(() => ({
      register: jest.fn(() => ({
        onBlur: jest.fn(),
        name: 'testDropdown'
      })),
      formState: {
        errors: {
          testDropdown: {
            message: 'エラーメッセージ'
          }
        }
      }
    }));

    render(
      <TestWrapper>
        <FormDropdown
          name="testDropdown"
          label="テストドロップダウン"
          options={mockOptions}
        />
      </TestWrapper>
    );

    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
  });
});
