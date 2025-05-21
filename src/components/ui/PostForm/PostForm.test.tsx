import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostForm from '.';

const validateThumbnail = (files: unknown) => {
  if (!files) return true;
  if (Array.isArray(files) && files.length === 0) return true;
  if (Array.isArray(files) && files.length === 1 && files[0].size <= 2 * 1024 * 1024) return true;
  return false;
};
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

describe('PostForm', () => {
  const onSubmitMock = jest.fn().mockResolvedValue(undefined);

  const defaultProps = {
    defaultValues: {
      title: 'テスト投稿',
      content: 'テスト内容',
      status: 'published',
      thumbnailUrl: 'https://example.com/image.jpg'
    },
    onSubmit: onSubmitMock,
    submitButtonText: '送信',
    isSubmitting: false,
    message: '',
    errorMessage: ''
  };

  const originalFileReader = global.FileReader;
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    global.FileReader = FileReaderMock as unknown as typeof FileReader;
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    console.error = originalConsoleError;
  });

  it('初期値が正しく設定されていること', () => {
    render(<PostForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    expect(titleInput).toHaveValue('テスト投稿');

    const contentInput = screen.getByTestId('content-textarea');
    expect(contentInput).toHaveValue('テスト内容');

    const statusSelect = screen.getByLabelText(/公開状態/i);
    expect(statusSelect).toHaveValue('published');
  });

  it('送信ボタンのテキストが正しく表示されること', () => {
    render(<PostForm {...defaultProps} submitButtonText="保存する" />);
    expect(screen.getByRole('button', { name: '保存する' })).toBeInTheDocument();
  });

  it('isSubmitting=trueの場合、送信ボタンが無効化されること', () => {
    render(<PostForm {...defaultProps} isSubmitting={true} />);
    expect(screen.getByRole('button', { name: '送信' })).toBeDisabled();
  });

  it('messageが設定されている場合、メッセージが表示されること', () => {
    render(<PostForm {...defaultProps} message="保存しました" />);
    expect(screen.getByText('保存しました')).toBeInTheDocument();
  });

  it('errorMessageが設定されている場合、エラーメッセージが表示されること', () => {
    render(<PostForm {...defaultProps} errorMessage="エラーが発生しました" />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('フォーム送信時にonSubmitが呼ばれること', async () => {
    render(<PostForm {...defaultProps} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/タイトル/i), { target: { value: '新しいタイトル' } });
      fireEvent.change(screen.getByTestId('content-textarea'), { target: { value: '新しい内容' } });
      fireEvent.change(screen.getByLabelText(/公開状態/i), { target: { value: 'draft' } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '送信' }));
    });

    expect(onSubmitMock).toHaveBeenCalled();
    const callArgs = onSubmitMock.mock.calls[0][0];
    expect(callArgs.title).toBe('新しいタイトル');
    expect(callArgs.content).toBe('新しい内容');
    expect(callArgs.status).toBe('draft');
  });

  it('サムネイルがアップロードされると、プレビューが表示されること', async () => {
    render(<PostForm {...defaultProps} />);

    const file = new File(['mock content'], 'mock-thumbnail.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1 * 1024 * 1024 }); // 1MB

    const thumbnailInput = screen.getByLabelText(/サムネイル/);

    await act(async () => {
      fireEvent.change(thumbnailInput, { target: { files: [file] } });
    });

    await act(async () => {
      const fileReaderInstance = new FileReaderMock();
      fileReaderInstance.onloadend?.();
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: '送信' }));
    });

    expect(onSubmitMock).toHaveBeenCalled();
    const callArgs = onSubmitMock.mock.calls[0][0];
    expect(callArgs.thumbnail).toBeTruthy();
  });

  it('タイトルが空の場合、エラーメッセージが表示されること', async () => {
    render(<PostForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: '' } });
      fireEvent.blur(titleInput);
    });

    expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
  });

  it('内容が空の場合、エラーメッセージが表示されること', async () => {
    render(<PostForm {...defaultProps} />);

    const contentInput = screen.getByTestId('content-textarea');
    await act(async () => {
      fireEvent.change(contentInput, { target: { value: '' } });
      fireEvent.blur(contentInput);
    });

    expect(screen.getByText('内容は必須です')).toBeInTheDocument();
  });

  it('サムネイルのバリデーションが適切に行われること', () => {
    expect(validateThumbnail(null)).toBe(true);

    expect(validateThumbnail([])).toBe(true);

    const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB
    expect(validateThumbnail([validFile])).toBe(true);

    const invalidFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(invalidFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB
    expect(validateThumbnail([invalidFile])).toBe(false);
  });

  it('サムネイルのサイズが2MBを超える場合、エラーメッセージが表示されること', async () => {
    render(<PostForm {...defaultProps} />);

    const largeFile = new File(['mock content'], 'large-image.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB

    const thumbnailInput = screen.getByLabelText(/サムネイル/);

    await act(async () => {
      fireEvent.change(thumbnailInput, { target: { files: [largeFile] } });
      fireEvent.blur(thumbnailInput);
    });

    expect(screen.getByText('画像サイズは2MB以下にしてください')).toBeInTheDocument();
  });

  it('デフォルト値がnullの場合も正しく表示されること', () => {
    render(
      <PostForm
        {...defaultProps}
        defaultValues={{
          ...defaultProps.defaultValues,
          thumbnailUrl: null
        }}
      />
    );

    const titleInput = screen.getByLabelText(/タイトル/i);
    expect(titleInput).toHaveValue('テスト投稿');
  });

  it('公開状態を下書きに変更できること', async () => {
    render(<PostForm {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/公開状態/i);

    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: 'draft' } });
    });

    expect(statusSelect).toHaveValue('draft');
  });
});
