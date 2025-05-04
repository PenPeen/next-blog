import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from './RegisterForm'

// Server Actionsをモック
jest.mock('@/app/actions/register', () => ({
  register: jest.fn().mockResolvedValue({ success: true })
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
    push: jest.fn()
  })
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks()
  })

  it('初期状態で正しくレンダリングされる', () => {
    render(<RegisterForm />)

    // フォームとインプットが存在するか確認
    expect(screen.getByLabelText(/名前/)).toBeInTheDocument()
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード$/)).toBeInTheDocument()
    expect(screen.getByLabelText(/パスワード（確認）/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登録する/ })).toBeInTheDocument()
  })

  it('バリデーションエラーを表示する', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    // 名前フィールドをスキップしてメールアドレスに移動
    await user.click(screen.getByLabelText(/名前/))
    await user.tab()

    // 不正な値の入力
    await user.click(screen.getByLabelText(/メールアドレス/))
    await user.keyboard('invalid-email')
    await user.tab()

    // 短いパスワードの入力
    await user.click(screen.getByLabelText(/パスワード$/))
    await user.keyboard('123')
    await user.tab()

    // 異なるパスワード（確認）の入力
    await user.click(screen.getByLabelText(/パスワード（確認）/))
    await user.keyboard('different')
    await user.tab()

    // 送信
    await user.click(screen.getByRole('button', { name: /登録する/ }))

    // エラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByText(/名前を入力してください/)).toBeInTheDocument()
      expect(screen.getByText(/有効なメールアドレスを入力してください/)).toBeInTheDocument()
      expect(screen.getByText(/パスワードは6文字以上で入力してください/)).toBeInTheDocument()
      expect(screen.getByText(/パスワードが一致しません/)).toBeInTheDocument()
    })
  })

  it('有効なフォーム入力で登録アクションが呼ばれる', async () => {
    const { register } = jest.requireMock('@/app/actions/register');
    const user = userEvent.setup();

    render(<RegisterForm />);

    // フォームに有効な値を入力
    await user.type(screen.getByLabelText(/名前/), '山田太郎')
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
    await user.type(screen.getByLabelText(/パスワード$/), 'password123')
    await user.type(screen.getByLabelText(/パスワード（確認）/), 'password123')

    // フォーム送信
    await user.click(screen.getByRole('button', { name: /登録する/ }))

    // Server Actionが呼ばれたか確認
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('山田太郎', 'test@example.com', 'password123')
    })
  })
})
