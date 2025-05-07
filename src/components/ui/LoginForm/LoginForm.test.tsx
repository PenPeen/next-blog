import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '.'
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

jest.mock('@/actions/login', () => ({
  login: jest.fn(),
}));

describe('LoginForm', () => {
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

    describe('ログイン中', () => {
      beforeEach(() => {
        const { login } = jest.requireMock('@/actions/login');
        (login as jest.Mock).mockReturnValue(new Promise(() => {}))
      });

      it('送信中はボタンのテキストが変更されて非活性になること', async () => {
        jest.mock('@/actions/login', () => ({
          login: jest.fn().mockImplementation(() => new Promise(() => {}))
        }));

        render(<LoginForm />)

        const user = userEvent.setup()
        await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
        await user.type(screen.getByLabelText('パスワード'), 'password123')
        await user.click(screen.getByRole('button', { name: 'ログイン' }))

        expect(screen.getByRole('button')).toHaveTextContent('ログイン中...')
        expect(screen.getByRole('button')).toBeDisabled()
      })
    })
  })
})
