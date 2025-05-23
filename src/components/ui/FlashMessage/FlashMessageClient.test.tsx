import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FlashMessageClient from "./FlashMessageClient";

describe('FlashMessageClient', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders correctly with success message', () => {
    render(<FlashMessageClient type="success" message="操作が成功しました" />);

    expect(screen.getByText('操作が成功しました')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();

    const messageElement = screen.getByText('操作が成功しました').closest('div');
    expect(messageElement).toHaveClass('flashMessage');
    expect(messageElement).toHaveClass('success');
  });

  it('renders correctly with error message', () => {
    render(<FlashMessageClient type="error" message="エラーが発生しました" />);

    const messageElement = screen.getByText('エラーが発生しました').closest('div');
    expect(messageElement).toHaveClass('flashMessage');
    expect(messageElement).toHaveClass('error');
  });

  it('renders correctly with warning message', () => {
    render(<FlashMessageClient type="warning" message="注意してください" />);

    const messageElement = screen.getByText('注意してください').closest('div');
    expect(messageElement).toHaveClass('flashMessage');
    expect(messageElement).toHaveClass('warning');
  });

  it('hides the message when close button is clicked', async () => {
    render(<FlashMessageClient type="success" message="操作が成功しました" />);

    expect(screen.getByText('操作が成功しました')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('閉じる');
    await user.click(closeButton);

    expect(screen.queryByText('操作が成功しました')).not.toBeInTheDocument();
  });

  it('hides the message after 5 seconds', () => {
    render(<FlashMessageClient type="success" message="操作が成功しました" />);

    expect(screen.getByText('操作が成功しました')).toBeInTheDocument();

    // 5秒後のタイマーを進める
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('操作が成功しました')).not.toBeInTheDocument();
  });
});
