import { render, screen } from "@testing-library/react";
import FlashMessage from ".";
import { getFlash } from "@/actions/flash";
import { v4 as uuid } from 'uuid';

jest.mock('@/actions/flash', () => ({
  getFlash: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('FlashMessage', () => {
  beforeEach(() => {
    (uuid as jest.Mock).mockReturnValue('test-uuid');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders success flash message when flash data exists', async () => {
    (getFlash as jest.Mock).mockResolvedValue({
      type: 'success',
      message: '操作が成功しました',
    });

    const { container } = render(await FlashMessage());

    expect(container.querySelector('.flashMessage')).toBeInTheDocument();
    expect(container.querySelector('.success')).toBeInTheDocument();
    expect(screen.getByText('操作が成功しました')).toBeInTheDocument();
  });

  it('renders error flash message when flash data exists', async () => {
    (getFlash as jest.Mock).mockResolvedValue({
      type: 'error',
      message: 'エラーが発生しました',
    });

    const { container } = render(await FlashMessage());

    expect(container.querySelector('.flashMessage')).toBeInTheDocument();
    expect(container.querySelector('.error')).toBeInTheDocument();
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('renders warning flash message when flash data exists', async () => {
    (getFlash as jest.Mock).mockResolvedValue({
      type: 'warning',
      message: '注意してください',
    });

    const { container } = render(await FlashMessage());

    expect(container.querySelector('.flashMessage')).toBeInTheDocument();
    expect(container.querySelector('.warning')).toBeInTheDocument();
    expect(screen.getByText('注意してください')).toBeInTheDocument();
  });

  it('returns null when no flash data exists', async () => {
    (getFlash as jest.Mock).mockResolvedValue(null);

    const { container } = render(await FlashMessage());

    expect(container.firstChild).toBeNull();
  });

  it('returns null when an error occurs', async () => {
    (getFlash as jest.Mock).mockRejectedValue(new Error('Test error'));

    // コンソールエラーをモック
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { container } = render(await FlashMessage());

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in FlashMessage component:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
