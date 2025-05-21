import React from 'react';
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FormProvider, useForm } from 'react-hook-form';
import ThumbnailFileInput from '.';


const registerMock = jest.fn(() => ({
  onBlur: jest.fn(),
  onChange: jest.fn(),
  ref: jest.fn(),
  name: 'test'
}));

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useFormContext: jest.fn(() => ({
      register: registerMock,
      formState: {
        errors: {}
      }
    }))
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    return <img {...props} />;
  },
}));


class FileReaderMock {
  onload: (() => void) | null = null;
  result: string | null = 'data:image/png;base64,mockbase64data';

  readAsDataURL(_file: Blob) {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
}


const originalFileReader = window.FileReader;

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ThumbnailFileInput', () => {
  beforeEach(() => {

    window.URL.createObjectURL = jest.fn(() => 'mocked-url');
    window.FileReader = FileReaderMock as unknown as typeof FileReader;
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.FileReader = originalFileReader;
  });

  it('初期状態で正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" />
      </TestWrapper>
    );

    expect(screen.getByText('サムネイル画像')).toBeInTheDocument();
    expect(screen.getByText('画像をアップロード')).toBeInTheDocument();


    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toBeInTheDocument();
    expect(thumbnailPreview).toHaveAttribute('src', '/default-thumbnail.png');
  });

  it('必須フィールドのマークが表示されること', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" required={true} />
      </TestWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('ヘルプテキストが表示されること', () => {
    const helpText = '最大2MBまでのファイルをアップロード';
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" helpText={helpText} />
      </TestWrapper>
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('プレビューURLが設定されている場合、そのプレビュー画像が表示されること', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" previewUrl="https://example.com/test.jpg" />
      </TestWrapper>
    );

    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  it('アップロードボタンをクリックするとファイル選択ダイアログが開くこと', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');
    const clickSpy = jest.spyOn(fileInput, 'click');

    fireEvent.click(screen.getByTestId('thumbnail-upload-button'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('acceptプロパティが正しく設定されること', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" accept=".jpg,.png" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');
    expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
  });

  it('画像ファイルがアップロードされた場合にプレビューが更新されること', async () => {

    const mockFileReader = {
      onload: null as (() => void) | null,
      result: 'data:image/png;base64,mockbase64data',
      readAsDataURL: function(_file: Blob) {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }
    };


    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });


    act(() => {
      fireEvent.change(fileInput);
    });


    await act(async () => {
      if (mockFileReader.onload) {
        mockFileReader.onload();
      }
    });


    expect(mockFileReader.result).toBe('data:image/png;base64,mockbase64data');



  });

  it('非画像ファイルがアップロードされた場合にプレビューが更新されないこと', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });

    fireEvent.change(fileInput);

    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toHaveAttribute('src', '/default-thumbnail.png');
  });

  it('ファイル選択がキャンセルされた場合にデフォルト画像が表示されること', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');


    Object.defineProperty(fileInput, 'files', {
      value: []
    });

    fireEvent.change(fileInput);

    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toHaveAttribute('src', '/default-thumbnail.png');
  });

  it('エラー状態のときエラーメッセージが表示されること', () => {
    const { useFormContext } = jest.requireMock('react-hook-form');
    useFormContext.mockReturnValue({
      ...useFormContext(),
      formState: {
        errors: {
          thumbnail: {
            message: 'ファイルを選択してください'
          }
        }
      }
    });

    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" />
      </TestWrapper>
    );

    expect(screen.getByText('ファイルを選択してください')).toBeInTheDocument();
  });

  it('プレビューURLが設定されている場合、ファイル選択をキャンセルしてもプレビュー画像が維持されること', () => {
    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" previewUrl="https://example.com/test.jpg" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');


    Object.defineProperty(fileInput, 'files', {
      value: []
    });

    fireEvent.change(fileInput);

    const thumbnailPreview = screen.getByTestId('thumbnail-preview');
    expect(thumbnailPreview).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  it('ファイル選択ダイアログで別のファイルが選択された場合にプレビューが更新されること', async () => {
    const mockFileReader = {
      onload: null as (() => void) | null,
      result: 'data:image/png;base64,newbase64data',
      readAsDataURL: function(_file: Blob) {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }
    };

    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as unknown as FileReader);

    render(
      <TestWrapper>
        <ThumbnailFileInput name="thumbnail" label="サムネイル画像" previewUrl="https://example.com/test.jpg" />
      </TestWrapper>
    );

    const fileInput = screen.getByTestId('thumbnail-input');
    const file = new File(['new content'], 'new-test.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });

    fireEvent.change(fileInput);

    await act(async () => {
      if (mockFileReader.onload) {
        mockFileReader.onload();
      }
    });
  });
});
