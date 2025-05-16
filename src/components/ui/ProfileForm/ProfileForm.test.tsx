import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileForm from './index';

const mockUpdateProfile = jest.fn().mockResolvedValue({ success: true });

jest.mock('@/actions/updateProfile', () => ({
  updateProfile: () => mockUpdateProfile(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useTransition: () => [false, (callback: () => void) => callback()],
  };
});

describe('ProfileForm', () => {
  const defaultProps = {
    email: 'test@example.com',
    name: 'テストユーザー',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateProfile.mockClear();
  });

  it('正しくレンダリングされること', () => {
    render(<ProfileForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/名前/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('テストユーザー');
    expect(screen.getByRole('button', { name: '更新する' })).toBeInTheDocument();
  });

  it('名前が空の場合にバリデーションエラーを表示すること', async () => {
    render(<ProfileForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/名前/i);
    await userEvent.clear(nameInput);
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('名前を入力してください')).toBeInTheDocument();
    });
  });

  it('フォーム送信時にupdateProfile関数が呼ばれること', async () => {
    render(<ProfileForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/名前/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, '新しい名前');

    const submitButton = screen.getByRole('button', { name: '更新する' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });
});
