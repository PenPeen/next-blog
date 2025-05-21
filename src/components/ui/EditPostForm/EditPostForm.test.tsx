import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyPostForm from './index';
import { makeClient } from '@/app/ApolloWrapper';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('@/app/ApolloWrapper', () => ({
  makeClient: jest.fn(),
}));
class FileReaderMock {
  onloadend: (() => void) | null = null;
  result: string | null = null;

  readAsDataURL(_file: Blob) {
    setTimeout(() => {
      this.result = 'data:image/png;base64,mockBase64Data';
      if (this.onloadend) this.onloadend();
    }, 0);
  }
}

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

  const originalFileReader = global.FileReader;
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
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

    global.FileReader = FileReaderMock as unknown as typeof FileReader;
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    console.error = originalConsoleError;
  });

  it('renders the form with initial values', () => {
    render(<MyPostForm {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('タイトルを入力');
    expect(titleInput).toHaveValue('テスト投稿');
    expect(screen.getByTestId('content-textarea')).toHaveValue('テスト内容');

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

    const statusSelect = screen.getByRole('combobox', { name: /公開状態/i });
    fireEvent.change(statusSelect, { target: { value: 'draft' } });

    expect(statusSelect).toHaveValue('draft');
  });

  it('validates form fields', async () => {
    render(<MyPostForm {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('タイトルを入力');
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.blur(titleInput);

    const contentInput = screen.getByTestId('content-textarea');
    fireEvent.change(contentInput, { target: { value: '' } });
    fireEvent.blur(contentInput);

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

    fireEvent.change(screen.getByPlaceholderText('タイトルを入力'), { target: { value: '更新されたタイトル' } });
    fireEvent.change(screen.getByTestId('content-textarea'), { target: { value: '更新された内容' } });
    fireEvent.change(screen.getByRole('combobox', { name: /公開状態/i }), { target: { value: 'draft' } });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '更新する' }));
    });

    await waitFor(() => {
      expect(screen.getByText('投稿を更新しました')).toBeInTheDocument();
    });

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

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '更新する' }));
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles exception during submission', async () => {
    const mockError = new Error('Network error');

    (makeClient as jest.Mock).mockReturnValue({
      mutate: jest.fn().mockRejectedValue(mockError),
    });

    render(<MyPostForm {...defaultProps} />);

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '更新する' }));
    });

    expect(console.error).toHaveBeenCalledWith('更新エラー:', mockError);

    await waitFor(() => {
      expect(screen.getByText('更新中にエラーが発生しました。しばらく経ってから再度試してください。')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '更新する' })).not.toBeDisabled();
    });
  });

  describe('サムネイルの処理', () => {
    it('サムネイルがアップロードされると、プレビューが表示されること', async () => {
      render(<MyPostForm {...defaultProps} />);

      const file = new File(['mock content'], 'mock-thumbnail.png', { type: 'image/png' });
      const thumbnailInput = screen.getByLabelText(/サムネイル/);

      await act(async () => {
        userEvent.upload(thumbnailInput, file);
      });

      await waitFor(() => {
        const previewImage = screen.getByTestId('thumbnail-preview');
        expect(previewImage).toBeInTheDocument();
        expect(previewImage).toHaveAttribute('alt', 'サムネイル画像');
      });
    });

    it('サムネイルが正しくSubmitされること', async () => {
      const mockExecuteMutation = jest.fn().mockResolvedValue({
        data: {
          updatePost: {
            id: '1',
            title: 'Updated Title',
            status: 'PUBLISHED',
            message: '投稿を更新しました'
          },
        },
      });

      const mockClient = {
        executeMutation: mockExecuteMutation,
        mutate: mockExecuteMutation
      };

      (makeClient as jest.Mock).mockReturnValue(mockClient);

      render(<MyPostForm {...defaultProps} />);

      await userEvent.type(screen.getByLabelText(/タイトル/), ' Updated');

      const file = new File(['mock content'], 'mock-thumbnail.png', { type: 'image/png' });
      const thumbnailInput = screen.getByLabelText(/サムネイル/);

      await act(async () => {
        userEvent.upload(thumbnailInput, file);
        const fileReaderInstance = new FileReader();
        fileReaderInstance.onloadend?.();
      });

      await userEvent.click(screen.getByLabelText(/公開/));

      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: '更新する' }));
      });

      await waitFor(() => {
        expect(mockExecuteMutation).toHaveBeenCalled();
      }, { timeout: 3000 });

      expect(mockExecuteMutation).toHaveBeenCalled();
    });
  });
});
