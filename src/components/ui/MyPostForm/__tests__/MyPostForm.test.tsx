import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyPostForm from '../index';
import { makeClient } from '@/app/ApolloWrapper';

// ApolloWrapperのモック
jest.mock('@/app/ApolloWrapper', () => ({
  makeClient: jest.fn(),
}));

// useRouterのモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe('MyPostForm', () => {
  const mockPost = {
    id: '1',
    title: 'テスト投稿',
    content: 'テスト内容',
    published: true,
    thumbnailUrl: null,
  };

  const defaultProps = {
    post: mockPost,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // makeClientのモック実装
    (makeClient as jest.Mock).mockReturnValue({
      mutate: jest.fn().mockResolvedValue({
        data: {
          updatePost: {
            post: {
              id: '1',
              title: 'テスト投稿',
              content: 'テスト内容',
              published: true,
            },
            errors: null,
          },
        },
      }),
    });
  });

  it('renders the form with initial values', () => {
    render(<MyPostForm {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('タイトルを入力');
    expect(titleInput).toHaveValue('テスト投稿');
    expect(screen.getByTestId('content-textarea')).toHaveValue('テスト内容');

    // デフォルト画像が表示されているか
    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toBeInTheDocument();
    expect(thumbnailPreview).toHaveAttribute('src', '/_next/image?url=%2Fdefault-thumbnail.png&w=640&q=75');
  });

  it('shows existing thumbnail when available', () => {
    const postWithThumbnail = {
      ...mockPost,
      thumbnailUrl: 'https://example.com/image.jpg',
    };

    render(<MyPostForm post={postWithThumbnail} />);

    // 既存のサムネイル画像が表示されているか
    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toBeInTheDocument();
    expect(thumbnailPreview).toHaveAttribute('src', '/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=640&q=75');
  });

  it('handles title input change', () => {
    render(<MyPostForm {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('タイトルを入力');
    fireEvent.change(titleInput, { target: { value: '新しいタイトル' } });

    expect(titleInput).toHaveValue('新しいタイトル');
  });

  it('handles content input change', () => {
    render(<MyPostForm {...defaultProps} />);

    const contentInput = screen.getByTestId('content-textarea');
    fireEvent.change(contentInput, { target: { value: '新しい内容' } });

    expect(contentInput).toHaveValue('新しい内容');
  });

  it('handles status dropdown change', () => {
    render(<MyPostForm {...defaultProps} />);

    // 選択肢を変更
    const statusSelect = screen.getByRole('combobox', { name: /公開状態/i });
    fireEvent.change(statusSelect, { target: { value: 'draft' } });

    expect(statusSelect).toHaveValue('draft');
  });

  it('validates form fields', async () => {
    render(<MyPostForm {...defaultProps} />);

    // タイトルを空にする
    const titleInput = screen.getByPlaceholderText('タイトルを入力');
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.blur(titleInput);

    // 内容を空にする
    const contentInput = screen.getByTestId('content-textarea');
    fireEvent.change(contentInput, { target: { value: '' } });
    fireEvent.blur(contentInput);

    // エラーメッセージが表示されるか確認
    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
      expect(screen.getByText('内容は必須です')).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    const mutationMock = jest.fn().mockResolvedValue({
      data: {
        updatePost: {
          post: {
            id: '1',
            title: '更新されたタイトル',
            content: '更新された内容',
            published: false,
          },
          errors: null,
        },
      },
    });

    (makeClient as jest.Mock).mockReturnValue({
      mutate: mutationMock,
    });

    render(<MyPostForm {...defaultProps} />);

    // フォームを更新
    fireEvent.change(screen.getByPlaceholderText('タイトルを入力'), { target: { value: '更新されたタイトル' } });
    fireEvent.change(screen.getByTestId('content-textarea'), { target: { value: '更新された内容' } });
    fireEvent.change(screen.getByRole('combobox', { name: /公開状態/i }), { target: { value: 'draft' } });

    // フォームを送信
    fireEvent.submit(screen.getByRole('button', { name: '更新する' }));

    // 成功メッセージが表示されるか確認
    await waitFor(() => {
      expect(screen.getByText('投稿を更新しました')).toBeInTheDocument();
    });

    // mutateが呼ばれたか確認
    expect(mutationMock).toHaveBeenCalledWith(expect.objectContaining({
      variables: {
        input: {
          postInput: {
            id: '1',
            title: '更新されたタイトル',
            content: '更新された内容',
            published: false,
            thumbnail: undefined
          }
        }
      }
    }));
  });

  it('handles submission error', async () => {
    const errorMessage = '更新中にエラーが発生しました';

    const mutationMock = jest.fn().mockResolvedValue({
      data: {
        updatePost: {
          post: null,
          errors: [
            {
              message: errorMessage,
              path: null,
            },
          ],
        },
      },
    });

    (makeClient as jest.Mock).mockReturnValue({
      mutate: mutationMock,
    });

    render(<MyPostForm {...defaultProps} />);

    // フォームを送信
    fireEvent.submit(screen.getByRole('button', { name: '更新する' }));

    // エラーメッセージが表示されるか確認
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
