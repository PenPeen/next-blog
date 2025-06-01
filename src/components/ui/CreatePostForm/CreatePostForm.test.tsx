import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostForm from '.';
import { createPost } from '@/mutations/createPost';
import { setFlash } from '@/actions/flash';
import { PostFormData } from '@/lib/schema/post';

jest.mock('@/mutations/createPost', () => ({
  createPost: jest.fn()
}));

jest.mock('@/actions/flash', () => ({
  setFlash: jest.fn()
}));

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock('@/components/ui/PostForm', () => {
  return function PostForm({
    defaultValues,
    onSubmit,
    submitButtonText,
    isSubmitting,
    message,
    errorMessage
  }: {
    defaultValues: PostFormData;
    onSubmit: (data: PostFormData) => void;
    submitButtonText: string;
    isSubmitting: boolean;
    message: string;
    errorMessage: string;
  }) {
    const [formData, setFormData] = React.useState(defaultValues);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} data-testid="post-form">
        <input
          data-testid="title-input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="タイトル"
        />
        <textarea
          data-testid="content-input"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="内容"
        />
        <select
          data-testid="status-select"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="draft">下書き</option>
          <option value="published">公開</option>
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          {submitButtonText}
        </button>
        {message && <div data-testid="success-message">{message}</div>}
        {errorMessage && <div data-testid="error-message">{errorMessage}</div>}
      </form>
    );
  };
});

describe('CreatePostForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態で正しいデフォルト値が設定されていること', () => {
    render(<CreatePostForm />);

    expect(screen.getByTestId('title-input')).toHaveValue('');
    expect(screen.getByTestId('content-input')).toHaveValue('');
    expect(screen.getByTestId('status-select')).toHaveValue('draft');
    expect(screen.getByTestId('submit-button')).toHaveTextContent('作成する');
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  it('投稿作成が成功した場合、フラッシュメッセージを設定して詳細ページに遷移すること', async () => {
    const mockPost = { id: 'post-123', title: 'テスト投稿' };
    (createPost as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ post: mockPost, errors: null });
        }, 100);
      });
    });
    (setFlash as jest.Mock).mockResolvedValue({});

    render(<CreatePostForm />);

    const user = userEvent.setup();
    const titleInput = screen.getByTestId('title-input');
    const contentInput = screen.getByTestId('content-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(titleInput, 'テストタイトル');
    await user.type(contentInput, 'テスト内容');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('作成中...');
      expect(submitButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith({
        title: 'テストタイトル',
        content: 'テスト内容',
        status: 'draft',
        thumbnailUrl: null
      });
    });

    await waitFor(() => {
      expect(setFlash).toHaveBeenCalledWith({
        message: '記事を作成しました',
        type: 'success'
      });
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(`/account/my-posts/${mockPost.id}`);
    });

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('作成する');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('エラーレスポンスが返された場合、エラーメッセージが表示されること', async () => {
    const mockErrors = [
      { message: 'タイトルは必須です' },
      { message: '内容は必須です' }
    ];
    (createPost as jest.Mock).mockResolvedValue({
      errors: mockErrors,
      post: null
    });

    render(<CreatePostForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toContain('タイトルは必須です');
      expect(errorMessage.textContent).toContain('内容は必須です');
    });

    expect(submitButton).toHaveTextContent('作成する');
    expect(submitButton).not.toBeDisabled();
  });

  it('単一のエラーメッセージが表示されること', async () => {
    const mockErrors = [{ message: 'タイトルは必須です' }];
    (createPost as jest.Mock).mockResolvedValue({
      errors: mockErrors,
      post: null
    });

    render(<CreatePostForm />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('タイトルは必須です');
    });
  });

  it('createPostでエラーが発生した場合、汎用エラーメッセージが表示されること', async () => {
    (createPost as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<CreatePostForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        '作成中にエラーが発生しました。しばらく経ってから再度試してください。'
      );
    });

    expect(submitButton).toHaveTextContent('作成する');
    expect(submitButton).not.toBeDisabled();
  });

  it('投稿作成成功だがpostが存在しない場合のエッジケース', async () => {
    (createPost as jest.Mock).mockResolvedValue({
      errors: null,
      post: null
    });

    render(<CreatePostForm />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(createPost).toHaveBeenCalled();
    });

    expect(setFlash).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('送信時にメッセージとエラーメッセージがリセットされること', async () => {
    (createPost as jest.Mock).mockResolvedValueOnce({
      errors: [{ message: '最初のエラー' }],
      post: null
    });

    render(<CreatePostForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('最初のエラー');
    });

    (createPost as jest.Mock).mockResolvedValueOnce({
      post: { id: 'post-123' },
      errors: null
    });
    (setFlash as jest.Mock).mockResolvedValue({});

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  it('ステータスが変更できること', async () => {
    (createPost as jest.Mock).mockResolvedValue({
      post: { id: 'post-123' },
      errors: null
    });
    (setFlash as jest.Mock).mockResolvedValue({});

    render(<CreatePostForm />);

    const user = userEvent.setup();
    const statusSelect = screen.getByTestId('status-select');
    const submitButton = screen.getByTestId('submit-button');

    await user.selectOptions(statusSelect, 'published');
    await user.click(submitButton);

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith({
        title: '',
        content: '',
        status: 'published',
        thumbnailUrl: null
      });
    });
  });

  it('送信中にボタンが無効化され、テキストが変更されること', async () => {
    (createPost as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ post: { id: 'post-123' }, errors: null });
        }, 100);
      });
    });

    render(<CreatePostForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByTestId('submit-button');

    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('作成中...');
      expect(submitButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('作成する');
      expect(submitButton).not.toBeDisabled();
    });
  });
});
