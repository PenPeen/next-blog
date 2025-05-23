import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackButton from ".";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe('BackButton', () => {
  const mockBack = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with children', () => {
    render(<BackButton>戻る</BackButton>);
    expect(screen.getByText('戻る')).toBeInTheDocument();
    expect(screen.getByText('戻る')).toHaveClass('backButton');
  });

  it('calls router.back when clicked', async () => {
    render(<BackButton>戻る</BackButton>);

    await user.click(screen.getByText('戻る'));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
