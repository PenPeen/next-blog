import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from '.'

jest.mock('next/navigation', () => {
  const actualNavigation = jest.requireActual('next/navigation');
  return {
    ...actualNavigation,
  };
});

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const mockRegister = jest.fn();
jest.mock('@/actions/register', () => ({
  register: (data: RegisterFormData) => mockRegister(data),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初期状態', () => {
    it('フォームの要素が正しく表示されること', () => {
      render(<RegisterForm />)

      expect(screen.getByLabelText(/名前/)).toBeInTheDocument()
      expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument()
      expect(screen.getByLabelText(/^パスワード\*/)).toBeInTheDocument()
      expect(screen.getByLabelText(/パスワード（確認）/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument()
    })

    it('フォームの初期値が空であること', () => {
      render(<RegisterForm />)

      expect(screen.getByLabelText(/名前/)).toHaveValue('')
      expect(screen.getByLabelText(/メールアドレス/)).toHaveValue('')
      expect(screen.getByLabelText(/^パスワード\*/)).toHaveValue('')
      expect(screen.getByLabelText(/パスワード（確認）/)).toHaveValue('')
    })

    it('エラーメッセージが表示されていないこと', () => {
      render(<RegisterForm />)

      expect(screen.queryByText('名前を入力してください')).not.toBeInTheDocument()
      expect(screen.queryByText('有効なメールアドレスを入力してください')).not.toBeInTheDocument()
      expect(screen.queryByText('パスワードは6文字以上で入力してください')).not.toBeInTheDocument()
      expect(screen.queryByText('パスワードが一致しません')).not.toBeInTheDocument()
    })
  })

  describe('バリデーション', () => {
    it('名前が空の場合にエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const nameInput = screen.getByLabelText(/名前/)
      await user.click(nameInput)
      await user.tab()

      expect(await screen.findByText('名前を入力してください')).toBeInTheDocument()
    })

    it('無効なメールアドレスを入力するとエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const emailInput = screen.getByLabelText(/メールアドレス/)
      await user.type(emailInput, 'invalid-email')
      await user.tab()

      expect(await screen.findByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })

    it('短すぎるパスワードを入力するとエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const passwordInput = screen.getByLabelText(/^パスワード\*/)
      await user.type(passwordInput, '12345')
      await user.tab()

      expect(await screen.findByText('パスワードは6文字以上で入力してください')).toBeInTheDocument()
    })

    it('パスワードが一致しない場合にエラーメッセージが表示されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      const passwordInput = screen.getByLabelText(/^パスワード\*/)
      await user.type(passwordInput, 'password123')

      const confirmInput = screen.getByLabelText(/パスワード（確認）/)
      await user.type(confirmInput, 'different123')
      await user.tab()

      expect(await screen.findByText('パスワードが一致しません')).toBeInTheDocument()
    })
  })

  describe('フォーム送信', () => {
    it('送信が成功した場合、登録処理が実行されること', async () => {
      render(<RegisterForm />)
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/名前/), 'テスト太郎')
      await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.type(screen.getByLabelText(/パスワード（確認）/), 'password123')

      await user.click(screen.getByLabelText(/利用規約に同意する/))
      await user.click(screen.getByRole('button', { name: '登録する' }))

      expect(mockRegister).toHaveBeenCalledWith({
        name: 'テスト太郎',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
        agreement: true
      })
    })

    it('送信中はボタンのテキストが変更されて非活性になること', async () => {
      mockRegister.mockReturnValue(new Promise(() => {}))

      render(<RegisterForm />)
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/名前/), 'テスト太郎')
      await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.type(screen.getByLabelText(/パスワード（確認）/), 'password123')
      await user.click(screen.getByLabelText(/利用規約に同意する/))

      await user.click(screen.getByRole('button', { name: '登録する' }))

      expect(screen.getByRole('button')).toHaveTextContent('登録中...')
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('登録に失敗した場合、エラーメッセージが表示されること', async () => {
      mockRegister.mockRejectedValue(new Error('メールアドレスは既に使用されています'));

      render(<RegisterForm />)
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/名前/), 'テスト太郎')
      await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.type(screen.getByLabelText(/パスワード（確認）/), 'password123')
      await user.click(screen.getByLabelText(/利用規約に同意する/))

      await user.click(screen.getByRole('button', { name: '登録する' }))

      expect(await screen.findByText('メールアドレスは既に使用されています')).toBeInTheDocument()
    })

    it('NEXT_REDIRECTエラーの場合はエラーメッセージが表示されないこと', async () => {
      const redirectError = new Error('NEXT_REDIRECT');
      mockRegister.mockRejectedValue(redirectError);

      render(<RegisterForm />)
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/名前/), 'テスト太郎')
      await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com')
      await user.type(screen.getByLabelText(/^パスワード\*/), 'password123')
      await user.type(screen.getByLabelText(/パスワード（確認）/), 'password123')
      await user.click(screen.getByLabelText(/利用規約に同意する/))

      await user.click(screen.getByRole('button', { name: '登録する' }))

      expect(await screen.findByRole('button', { name: '登録する' })).toBeInTheDocument()
      expect(screen.queryByText('NEXT_REDIRECT')).not.toBeInTheDocument()
    })
  })
})
