import { render, screen } from "@testing-library/react";
import PostContent from ".";
import { PostFragment } from "@/app/graphql/types";
import { Comment } from "@/app/graphql/generated";

jest.mock("@/components/ui/BackButton", () => ({
  __esModule: true,
  default: function MockBackButton({ children }: { children: React.ReactNode }) {
    return <div data-testid="back-button">{children}</div>;
  }
}));

jest.mock("@/components/ui/MainTitle", () => ({
  __esModule: true,
  default: function MockMainTitle({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-title">{children}</div>;
  }
}));

jest.mock("@/components/ui/DateFormatter", () => ({
  __esModule: true,
  default: function MockFormattedDate() {
    return <div data-testid="formatted-date">2023-01-01</div>;
  }
}));

jest.mock("@/components/ui/CommentList", () => ({
  __esModule: true,
  default: function MockCommentList({ comments }: { comments: Comment[] }) {
    return (
      <div data-testid="comment-list">
        コメント数: {comments.length}
      </div>
    );
  }
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt }: { src: string, alt: string }) {
    return <img src={src} alt={alt} data-testid="next-image" />;
  }
}));

describe("PostContent", () => {
  const mockPost: PostFragment = {
    title: "テスト投稿",
    content: "テスト内容",
    thumbnailUrl: "https://example.com/image.jpg",
    createdAt: "2023-01-01T00:00:00Z",
    comments: [
      {
        id: "1",
        content: "テストコメント1",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        user: {
          id: "1",
          name: "テストユーザー1",
          email: "test1@example.com",
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          userImage: null,
          posts: null
        },
        post: {
          id: "1",
          title: "テスト投稿",
          content: "テスト内容",
          published: true,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          thumbnailUrl: null,
          user: {
            id: "1",
            name: "テストユーザー",
            email: "test@example.com",
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z",
            userImage: null,
            posts: null
          },
          comments: []
        }
      }
    ]
  };

  const mockPostWithoutThumbnail: PostFragment = {
    ...mockPost,
    thumbnailUrl: null
  };

  it("投稿内容が正しく表示されること", () => {
    render(<PostContent post={mockPost} />);

    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    expect(screen.getByText("← 戻る")).toBeInTheDocument();
    expect(screen.getByTestId("main-title")).toBeInTheDocument();
    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByTestId("formatted-date")).toBeInTheDocument();
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
    expect(screen.getByTestId("comment-list")).toBeInTheDocument();
    expect(screen.getByText("コメント数: 1")).toBeInTheDocument();
  });

  it("サムネイルがない場合、サムネイル要素が表示されないこと", () => {
    render(<PostContent post={mockPostWithoutThumbnail} />);

    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
  });
});
