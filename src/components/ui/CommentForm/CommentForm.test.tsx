import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentForm from '.';
import { createComment } from '@/actions/createComment';
import { User } from '@/app/graphql/generated';

jest.mock('@/actions/createComment', () => ({
  createComment: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('CommentForm', () => {
  const postId = 'post-123';
  const mockUser = {
    id: 'user-123',
    name: 'テストユーザー',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userImage: { profile: null }
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
    (createComment as jest.Mock).mockResolvedValue({ success: true });
  });

  it('ログインしていないときに入力フィールドが無効化されていること', () => {
    render(<CommentForm postId={postId} currentUser={null} />);

    const textarea = screen.getByTestId('comment-textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('placeholder', 'コメントを投稿するにはログインが必要です');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('ログイン中は入力フィールドが有効であること', () => {
    render(<CommentForm postId={postId} currentUser={mockUser} />);

    expect(screen.getByTestId('comment-textarea')).not.toBeDisabled();
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.queryByText('コメントを投稿するにはログインが必要です')).not.toBeInTheDocument();
  });

  it('空のコメントを送信するとエラーが表示されること', async () => {
    render(<CommentForm postId={postId} currentUser={mockUser} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'コメントを投稿' }));

    expect(await screen.findByText('コメント内容を入力してください')).toBeInTheDocument();
  });

  it('コメントが正常に送信されると入力フィールドがリセットされること', async () => {
    (createComment as jest.Mock).mockResolvedValue({ success: true });

    render(
      <CommentForm
        postId={postId}
        currentUser={mockUser}
      />
    );

    const user = userEvent.setup();
    const textarea = screen.getByTestId('comment-textarea');

    await user.type(textarea, 'テストコメント');
    await user.click(screen.getByRole('button', { name: 'コメントを投稿' }));

    await waitFor(() => {
      expect(createComment).toHaveBeenCalled();
      const formData = (createComment as jest.Mock).mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('postId')).toBe(postId);
      expect(formData.get('content')).toBe('テストコメント');
    });

    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('送信中にボタンが無効化され、テキストが変更されること', async () => {
    (createComment as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 100);
      });
    });

    render(
      <CommentForm postId={postId} currentUser={mockUser} />
    );

    const user = userEvent.setup();
    await user.type(screen.getByTestId('comment-textarea'), 'テストコメント');

    const submitButton = screen.getByRole('button', { name: 'コメントを投稿' });
    await user.click(submitButton);

    expect(submitButton).toHaveTextContent('送信中...');
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('コメントを投稿');
      expect(submitButton).not.toBeDisabled();
    });
  });
});
