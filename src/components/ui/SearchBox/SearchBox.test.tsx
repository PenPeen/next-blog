import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from ".";
import * as nextNavigation from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SearchBox', () => {
  const mockPush = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.useFakeTimers();
    user = userEvent.setup({ delay: null });

    (nextNavigation.useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(''),
    });

    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    render(<SearchBox />);
    expect(screen.getByPlaceholderText('記事を検索...')).toBeInTheDocument();
  });

  it('debounces search input and navigates after delay', async () => {
    render(<SearchBox />);

    const searchInput = screen.getByPlaceholderText('記事を検索...');
    await user.type(searchInput, 'test words');

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(mockPush).toHaveBeenCalledWith('/?title=test words');
  });
});
