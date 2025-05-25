import { render, screen } from "@testing-library/react";
import PostContent from ".";
import { PostFragment } from "@/app/graphql";

jest.mock("@/components/ui/BackButton", () => {
  return function MockBackButton({ children }: { children: React.ReactNode }) {
    return <div data-testid="back-button">{children}</div>;
  };
});

jest.mock("@/components/ui/MainTitle", () => {
  return function MockMainTitle({ children }: { children: React.ReactNode }) {
    return <h1 data-testid="main-title">{children}</h1>;
  };
});

jest.mock("@/components/ui/DateFormatter", () => {
  return function MockFormattedDate({ date }: { date: string }) {
    return <div data-testid="formatted-date">{date}</div>;
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'> & {
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
  }) => {
    const { fill, priority, unoptimized, ...imgProps } = props;

    return (
      // eslint-disable-next-line
      <img
        data-testid="next-image"
        data-fill={fill ? "true" : undefined}
        data-priority={priority ? "true" : undefined}
        data-unoptimized={unoptimized ? "true" : undefined}
        {...imgProps}
      />
    );
  },
}));

describe("PostContent", () => {
  const mockPostWithThumbnail: PostFragment = {
    title: "テスト記事タイトル",
    content: "これはテスト記事の内容です。",
    thumbnailUrl: "https://example.com/test-image.jpg",
    createdAt: "2023-01-01T00:00:00Z",
    __typename: "Post",
  };

  const mockPostWithoutThumbnail: PostFragment = {
    title: "サムネイルなしの記事",
    content: "これはサムネイルのない記事です。",
    thumbnailUrl: null,
    createdAt: "2023-01-02T00:00:00Z",
    __typename: "Post",
  };

  it("renders post with thumbnail correctly", () => {
    render(<PostContent post={mockPostWithThumbnail} />);

    expect(screen.getByTestId("main-title")).toHaveTextContent("テスト記事タイトル");
    expect(screen.getByTestId("back-button")).toHaveTextContent("← 戻る");
    expect(screen.getByTestId("formatted-date")).toHaveTextContent("2023-01-01T00:00:00Z");

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("src", "https://example.com/test-image.jpg");
    expect(image).toHaveAttribute("alt", "テスト記事タイトル");

    expect(screen.getByText("これはテスト記事の内容です。")).toBeInTheDocument();
  });

  it("renders post without thumbnail correctly", () => {
    render(<PostContent post={mockPostWithoutThumbnail} />);

    expect(screen.getByTestId("main-title")).toHaveTextContent("サムネイルなしの記事");
    expect(screen.getByTestId("back-button")).toHaveTextContent("← 戻る");
    expect(screen.getByTestId("formatted-date")).toHaveTextContent("2023-01-02T00:00:00Z");
    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
    expect(screen.getByText("これはサムネイルのない記事です。")).toBeInTheDocument();
  });
});
