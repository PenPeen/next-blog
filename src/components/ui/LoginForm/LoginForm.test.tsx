import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '.';
import { login } from '@/actions/login';


jest.mock('@/actions/login', () => ({
  login: jest.fn(),
}));


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


    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'ログイン' }));


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


    expect(screen.getByRole('button')).toHaveTextContent('ログイン');


    await user.click(screen.getByRole('button', { name: 'ログイン' }));


    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('ログイン中...');
      expect(screen.getByRole('button')).toBeDisabled();
    });


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


      const formData = (login as jest.Mock).mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('email')).toBe('test@example.com');
      expect(formData.get('password')).toBe('password123');
    });
  });
});
