import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'
import React from 'react';

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn().mockImplementation(originalReact.useState)
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (React.useState as jest.Mock).mockImplementation(
      jest.requireActual('react').useState
    );
  });

  describe('初期状態', () => {
    it('フォームの要素が正しく表示されること', () => {
      render(<LoginForm />)

      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
    })

    it('フォームの初期値が空であること', () => {
      render(<LoginForm />)

      expect(screen.getByLabelText('メールアドレス')).toHaveValue('')
      expect(screen.getByLabelText('パスワード')).toHaveValue('')
    })

    it('エラーメッセージが表示されていないこと', () => {
      render(<LoginForm />)

      expect(screen.queryByText('有効なメールアドレスを入力してください')).not.toBeInTheDocument()
    })
  })

  describe('各種処理', () => {
    it('無効なメールアドレスを入力するとエラーメッセージが表示されること', async () => {
      render(<LoginForm />)
      const user = userEvent.setup()

      const emailInput = screen.getByLabelText('メールアドレス')
      await user.type(emailInput, 'invalid-email')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
      })
    })

    it('短すぎるパスワードを入力するとエラーメッセージが表示されること', async () => {
      render(<LoginForm />)
      const user = userEvent.setup()

      const passwordInput = screen.getByLabelText('パスワード')
      await user.type(passwordInput, '12345')
      await user.tab()

      const errorElement = screen.getByText('パスワードは6文字以上で入力してください');
      expect(errorElement).toBeVisible();
    })

    it('送信中はボタンのテキストが変更されて非活性になること', async () => {
      (React.useState as jest.Mock).mockImplementation((initialValue) => {
        if (initialValue === false) {
          return [true, jest.fn()];
        }
        return jest.requireActual('react').useState(initialValue);
      });

      render(<LoginForm />)

      expect(screen.getByRole('button')).toHaveTextContent('ログイン中...')
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
