import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DeletePostForm from '.';
import { useRouter } from 'next/navigation';
import { makeClient } from '@/app/ApolloWrapper';
import { DeletePostDocument } from '@/app/graphql/generated';
import { setFlash } from '@/actions/flash';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/ApolloWrapper', () => ({
  makeClient: jest.fn(),
}));

jest.mock('@/actions/flash', () => ({
  setFlash: jest.fn(),
}));

describe('DeletePostForm', () => {
  const mockPost = {
    id: '1',
    title: 'テスト投稿',
    content: 'テスト内容',
    published: true,
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockMutate = jest.fn();
  const mockClient = {
    mutate: mockMutate,
  };

  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (makeClient as jest.Mock).mockReturnValue(mockClient);
    jest.clearAllMocks();
  });

  it('初期状態で正しくレンダリングされること', () => {
    render(<DeletePostForm post={mockPost} />);

    expect(screen.getByRole('heading', { name: '投稿を削除' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '投稿を削除する' })).toBeInTheDocument();
  });

  it('削除ボタンをクリックするとモーダルが表示されること', async () => {
    render(<DeletePostForm post={mockPost} />);

    const user = userEvent.setup();

    const deleteButton = screen.getByRole('button', { name: '投稿を削除する' });
    await user.click(deleteButton);

    expect(screen.getByText(`「${mockPost.title}」を削除しますか？この操作は取り消せません。`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '削除する' })).toBeInTheDocument();
  });

  it('キャンセルボタンをクリックするとモーダルが閉じること', async () => {
    render(<DeletePostForm post={mockPost} />);

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: '投稿を削除する' });
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await user.click(cancelButton);

    expect(screen.queryByText(`「${mockPost.title}」を削除しますか？この操作は取り消せません。`)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'キャンセル' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '削除する' })).not.toBeInTheDocument();
  });

  it('削除が成功したとき、メッセージを表示して画面遷移すること', async () => {
    mockMutate.mockResolvedValueOnce({
      data: {
        deletePost: {
          success: true,
          message: '投稿を削除しました',
        },
      },
    });

    render(<DeletePostForm post={mockPost} />);

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: '投稿を削除する' });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: '削除する' });
    await user.click(confirmButton);

    expect(mockClient.mutate).toHaveBeenCalledWith({
      mutation: DeletePostDocument,
      variables: {
        input: {
          id: mockPost.id,
        },
      },
    });

    expect(setFlash).toHaveBeenCalledWith({
      message: '投稿を削除しました',
      type: 'success'
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/account');
  });

  it('削除APIがエラーを返したとき、エラーメッセージを表示すること', async () => {
    const errorMessage = '削除権限がありません';
    mockMutate.mockResolvedValueOnce({
      data: {
        deletePost: {
          success: false,
          errors: [{ message: errorMessage }],
        },
      },
    });

    render(<DeletePostForm post={mockPost} />);

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: '投稿を削除する' });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: '削除する' });
    await user.click(confirmButton);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('削除APIが例外をスローしたとき、汎用エラーメッセージを表示すること', async () => {
    mockMutate.mockRejectedValueOnce(new Error('Network error'));

    render(<DeletePostForm post={mockPost} />);

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: '投稿を削除する' });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: '削除する' });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('削除中にエラーが発生しました。しばらく経ってから再度試してください。')).toBeInTheDocument();
    });

    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
