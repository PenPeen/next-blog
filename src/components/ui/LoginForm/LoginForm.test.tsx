import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '.'
import React from 'react';

jest.mock('next/navigation', () => {
  const actualNavigation = jest.requireActual('next/navigation');

  return {
    ...actualNavigation,
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  };
});

const mockLogin = jest.fn();
jest.mock('@/actions/login', () => ({
  login: (formData: FormData) => mockLogin(formData),
}));

describe('LoginForm', () => {
  describe('初期状態', () => {
    it('フォームの要素が正しく表示されること', () => {
      render(<LoginForm />)

      expect(screen.getByRole('textbox', { name: /メールアドレス/ })).toBeInTheDocument()
      expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
    })

    it('フォームの初期値が空であること', () => {
      render(<LoginForm />)

      expect(screen.getByRole('textbox', { name: /メールアドレス/ })).toHaveValue('')
      expect(screen.getByLabelText(/パスワード/)).toHaveValue('')
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

      const emailInput = screen.getByRole('textbox', { name: /メールアドレス/ })
      await user.type(emailInput, 'invalid-email')
      await user.tab()

      expect(await screen.findByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })

    it('短すぎるパスワードを入力するとエラーメッセージが表示されること', async () => {
      render(<LoginForm />)
      const user = userEvent.setup()

      const passwordInput = screen.getByLabelText(/^パスワード\*/)
      await user.type(passwordInput, '12345')
      await user.tab()

      expect(await screen.findByText('パスワードは6文字以上で入力してください')).toBeInTheDocument()
    })

    describe('ログイン中', () => {
      it('送信中はボタンのテキストが変更されて非活性になること', async () => {
        mockLogin.mockReturnValue(new Promise(() => {}));

        render(<LoginForm />)

        const user = userEvent.setup()
        await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com')
        await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
        await user.click(screen.getByRole('button', { name: 'ログイン' }))

        expect(screen.getByRole('button')).toHaveTextContent('ログイン中...')
        expect(screen.getByRole('button')).toBeDisabled()
      })
    })
  })

  describe('ログイン結果処理', () => {
    it('ログインが成功し、リダイレクトURLが返された場合はpushが呼ばれること', async () => {
      const pushMock = jest.fn();
      const useRouterMock = jest.requireMock('next/navigation').useRouter;
      useRouterMock.mockReturnValue({
        push: pushMock
      });

      mockLogin.mockResolvedValue({
        success: true,
        redirectUrl: '/dashboard'
      });

      render(<LoginForm />)
      const user = userEvent.setup()

      await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })

    it('ログインが失敗した場合、エラーメッセージが表示されること', async () => {
      mockLogin.mockResolvedValue({
        success: false,
        error: 'メールアドレスまたはパスワードが間違っています'
      });

      render(<LoginForm />)
      const user = userEvent.setup()

      await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      expect(await screen.findByText('メールアドレスまたはパスワードが間違っています')).toBeInTheDocument()
    })

    it('APIコールが例外を投げた場合、一般エラーメッセージが表示されること', async () => {
      mockLogin.mockRejectedValue(new Error('API Error'));

      render(<LoginForm />)
      const user = userEvent.setup()

      await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      expect(await screen.findByText('原因不明のエラーが発生しました。再度お試しください。')).toBeInTheDocument()
    })
  })
})
