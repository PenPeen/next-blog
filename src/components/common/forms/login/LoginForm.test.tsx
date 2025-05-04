import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'
import React from 'react';

// Server Actionsをモック
jest.mock('@/app/actions/auth', () => ({
  login: jest.fn().mockResolvedValue({ success: true })
}))

// React hooksのモック
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn().mockImplementation((initialValue) => [initialValue, jest.fn()]),
  useTransition: jest.fn().mockImplementation(() => [false, jest.fn()])
}))

// 次のページへのナビゲーションをモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態で正しくレンダリングされる', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ログイン/ })).toBeInTheDocument()
  })

  it('バリデーションエラーを表示する', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    // 無効なメールアドレスを入力
    await user.type(screen.getByLabelText(/メールアドレス/), 'invalid-email')
    await user.tab()

    // 短いパスワードを入力
    await user.type(screen.getByLabelText(/パスワード/), '12345')
    await user.tab()

    // フォーム送信
    await user.click(screen.getByRole('button', { name: /ログイン/ }))

    // エラーメッセージが表示されるか確認
    await waitFor(() => {
      expect(screen.getByText(/有効なメールアドレスを入力してください/)).toBeInTheDocument()
      expect(screen.getByText(/パスワードは6文字以上で入力してください/)).toBeInTheDocument()
    })
  })

  it('有効なフォーム送信でログインアクションが呼ばれる', async () => {
    const { login } = jest.requireMock('@/app/actions/auth')
    const user = userEvent.setup()

    render(<LoginForm />)

    // 有効な値を入力
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
    await user.type(screen.getByLabelText(/パスワード/), 'password123')

    // フォーム送信
    await user.click(screen.getByRole('button', { name: /ログイン/ }))

    // loginアクションが正しく呼ばれたか確認
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('ログイン失敗時にエラーメッセージを表示する', async () => {
    // ログイン失敗のモック
    const { login } = jest.requireMock('@/app/actions/auth')
    login.mockResolvedValueOnce({ success: false, error: 'ログインに失敗しました' })

    const user = userEvent.setup()
    render(<LoginForm />)

    // フォーム入力と送信
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
    await user.type(screen.getByLabelText(/パスワード/), 'password123')
    await user.click(screen.getByRole('button', { name: /ログイン/ }))

    // エラーメッセージが表示されるか確認
    await waitFor(() => {
      expect(screen.getByText(/ログインに失敗しました/)).toBeInTheDocument()
    })
  })
})
