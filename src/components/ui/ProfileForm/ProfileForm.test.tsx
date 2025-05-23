import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileForm from './index';

const mockUpdateProfile = jest.fn().mockResolvedValue({ success: true });

jest.mock('@/actions/updateProfile', () => ({
  updateProfile: (formData: { name: string; profileImage?: File }) => mockUpdateProfile(formData),
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
      const calledArg = mockUpdateProfile.mock.calls[0][0];
      expect(calledArg.name).toBe('新しい名前');
    });
  });

  it('名前が10文字を超える場合にバリデーションエラーを表示すること', async () => {
    render(<ProfileForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/名前/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'これは十文字を超える名前です');
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('名前は10文字以内で入力してください。')).toBeInTheDocument();
    });
  });

  it('メールアドレスフィールドがフォームに存在し、読み取り専用であること', async () => {
    render(<ProfileForm email="invalid-email" name="テストユーザー" />);

    expect(screen.getByLabelText(/名前/i)).toBeInTheDocument();
  });

  it('プロフィール画像URLが指定されている場合に正しく表示されること', () => {
    render(<ProfileForm {...defaultProps} profileImageUrl="https://example.com/image.jpg" />);

    const profileImage = screen.getByRole('img');
    expect(profileImage).toBeInTheDocument();

    const imageUrl = profileImage.getAttribute('src');
    expect(imageUrl).toContain('_next/image');
    expect(imageUrl).toContain('example.com%2Fimage.jpg');
  });

  it('プロフィール画像URLが指定されていない場合でも正しく表示されること', () => {
    render(<ProfileForm {...defaultProps} />);

    expect(screen.getByLabelText(/プロフィール画像/i)).toBeInTheDocument();
  });

  it('更新中の状態が正しく表示されること', async () => {
    mockUpdateProfile.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

    render(<ProfileForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: '更新する' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '更新中...' })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: '更新中...' })).toBeDisabled();

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it('プロフィール画像のバリデーションが正しく機能すること', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 }); // 1MBサイズ

    render(<ProfileForm {...defaultProps} />);

    const fileInput = screen.getByLabelText(/プロフィール画像/i);
    expect(fileInput).toBeInTheDocument();

    await userEvent.upload(fileInput, mockFile);

    const submitButton = screen.getByRole('button', { name: '更新する' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it('画像サイズが大きすぎる場合にバリデーションエラーが表示されること', async () => {
    const largeFile = new File(['test'], 'large-image.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB（制限の2MBを超える）

    render(<ProfileForm {...defaultProps} />);

    const fileInput = screen.getByLabelText(/プロフィール画像/i);
    await userEvent.upload(fileInput, largeFile);

    const submitButton = screen.getByRole('button', { name: '更新する' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('画像サイズは2MB以下にしてください')).toBeInTheDocument();
    });

    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it('フォーカス処理が正しく機能すること', async () => {
    render(<ProfileForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/名前/i);
    await userEvent.click(nameInput);
    expect(document.activeElement).toBe(nameInput);

    await userEvent.tab();
    expect(document.activeElement).not.toBe(nameInput);
  });

  it('複数のフィールドを同時に入力して更新できること', async () => {
    render(<ProfileForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/名前/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, '山田太郎');

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    Object.defineProperty(mockFile, 'size', { value: 1024 * 512 }); // 512KB

    const fileInput = screen.getByLabelText(/プロフィール画像/i);
    await userEvent.upload(fileInput, mockFile);

    const submitButton = screen.getByRole('button', { name: '更新する' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
      const calledArg = mockUpdateProfile.mock.calls[0][0];
      expect(calledArg.name).toBe('山田太郎');
      expect(calledArg.profileImage).toBeTruthy();
      expect(calledArg.profileImage.length).toBe(1);
    });
  });
});
