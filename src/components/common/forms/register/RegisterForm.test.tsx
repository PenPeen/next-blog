import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from './RegisterForm'

jest.mock('@/hooks/auth/useRegister', () => ({
  useRegister: () => mockUseRegister
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

jest.mock('@apollo/client', () => ({
  useMutation: () => [jest.fn(), { loading: false, error: null }]
}))

const mockUseRegister: {
  register: jest.Mock;
  isLoading: boolean;
  error: string | null;
} = {
  register: jest.fn().mockResolvedValue(undefined),
  isLoading: false,
  error: null
}

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(React.useState as jest.Mock).mockImplementation(
      jest.requireActual('react').useState
    )
    mockUseRegister.isLoading = false
    mockUseRegister.error = null
  })

  describe('初期状態', () => {
    it('フォームの要素が正しく表示されること', () => {
      render(<RegisterForm />)

      expect(screen.getByLabelText('名前')).toBeInTheDocument()
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
      expect(screen.getByLabelText('パスワード（確認）')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument()
    })

    it('フォームの初期値が空であること', () => {
      render(<RegisterForm />)

      expect(screen.getByLabelText('名前')).toHaveValue('')
      expect(screen.getByLabelText('メールアドレス')).toHaveValue('')
      expect(screen.getByLabelText('パスワード')).toHaveValue('')
      expect(screen.getByLabelText('パスワード（確認）')).toHaveValue('')
    })

    it('エラーメッセージが表示されていないこと', () => {
      render(<RegisterForm />)

      expect(screen.queryByText('有効なメールアドレスを入力してください')).not.toBeInTheDocument()
      expect(screen.queryByText('パスワードは6文字以上で入力してください')).not.toBeInTheDocument()
    })
  })

  describe('各種処理', () => {
    it('名前が空の場合にエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const nameInput = screen.getByLabelText('名前')
      await user.click(nameInput)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('名前を入力してください')).toBeInTheDocument()
      })
    })

    it('無効なメールアドレスを入力するとエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const emailInput = screen.getByLabelText('メールアドレス')
      await user.type(emailInput, 'invalid-email')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
      })
    })

    it('短すぎるパスワードを入力するとエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const passwordInput = screen.getByLabelText('パスワード')
      await user.type(passwordInput, '12345')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('パスワードは6文字以上で入力してください')).toBeInTheDocument()
      })
    })

    it('パスワードが一致しない場合にエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const passwordInput = screen.getByLabelText('パスワード')
      await user.type(passwordInput, '123456')

      const confirmInput = screen.getByLabelText('パスワード（確認）')
      await user.type(confirmInput, '654321')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
      })
    })

    it('送信中はボタンのテキストが変更されて非活性になること', async () => {
      mockUseRegister.isLoading = true

      render(<RegisterForm />)
      expect(screen.getByRole('button')).toHaveTextContent('登録中...')
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('送信が成功した場合、フォームの内容が送信されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      await user.type(screen.getByLabelText('名前'), 'テスト太郎')
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.type(screen.getByLabelText('パスワード（確認）'), 'password123')

      await user.click(screen.getByRole('button', { name: '登録する' }))

      await waitFor(() => {
        expect(mockUseRegister.register).toHaveBeenCalledWith(
          'テスト太郎',
          'test@example.com',
          'password123'
        )
      })
    })

    it('エラーがある場合、エラーメッセージが表示されること', async () => {
      mockUseRegister.error = 'メールアドレスは既に使用されています'

      render(<RegisterForm />)

      expect(screen.getByText('メールアドレスは既に使用されています')).toBeInTheDocument()
    })
  })
})
