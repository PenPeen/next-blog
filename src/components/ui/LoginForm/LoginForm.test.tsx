import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '.';
import { login } from '@/actions/login';

// ログインアクションのモック
jest.mock('@/actions/login', () => ({
  login: jest.fn(),
}));

// useRouterのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メールアドレスが空の場合に正しいエラーメッセージが表示されること', async () => {
    render(<LoginForm />);

    // フォーム送信
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    // エラーメッセージが表示されることを確認（実際に表示されるメッセージに合わせて修正）
    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    });
  });

  it('メールアドレスが無効な形式の場合に正しいエラーメッセージが表示されること', async () => {
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'invalidmail');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(await screen.findByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
  });

  it('パスワードが短すぎる場合に正しいエラーメッセージが表示されること', async () => {
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com');
    await user.type(screen.getByLabelText(/^パスワード\*/), '12345');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(await screen.findByText('パスワードは6文字以上で入力してください')).toBeInTheDocument();
  });

  it('ログイン処理中にボタンの表示が変わること', async () => {
    // 処理時間を設けるためにログインアクションの実行を遅延させる
    (login as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 100);
      });
    });

    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com');
    await user.type(screen.getByLabelText(/^パスワード\*/), 'password123');

    // フォーム送信前にボタンのテキストを確認
    expect(screen.getByRole('button')).toHaveTextContent('ログイン');

    // フォーム送信
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    // ボタンがログイン中...と表示され、非活性になることを確認
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('ログイン中...');
      expect(screen.getByRole('button')).toBeDisabled();
    });

    // ログイン処理完了後
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('ログイン');
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('フォームデータが正しく作成されてAPIに送信されること', async () => {
    (login as jest.Mock).mockResolvedValue({ success: true });

    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: /メールアドレス/ }), 'test@example.com');
    await user.type(screen.getByLabelText(/^パスワード\*/), 'password123');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();

      // モックに渡されたFormDataを検証
      const formData = (login as jest.Mock).mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('password')).toBe('password123');
    });
  });
});
