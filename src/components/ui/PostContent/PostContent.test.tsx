import { render, screen } from "@testing-library/react";
import PostContent from ".";
import { PostFragment, User } from "@/app/graphql/generated";
import { Comment } from "@/app/graphql/generated";
import { getCurrentUser } from "@/fetcher";

jest.mock("@/fetcher", () => ({
  getCurrentUser: jest.fn(),
}));

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

jest.mock("@/components/ui/CommentForm", () => ({
  __esModule: true,
  default: function MockCommentForm({ postId, currentUser }: { postId: string, currentUser: User | null }) {
    return (
      <div data-testid="comment-form">
        投稿ID: {postId}, ログイン状態: {currentUser ? 'ログイン中' : '未ログイン'}
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
  const mockPost = {
    id: "1",
    title: "テスト投稿",
    content: "テスト内容",
    thumbnailUrl: "https://example.com/image.jpg",
    createdAt: "2023-01-01T00:00:00Z",
    comments: [
      {
        id: "1",
        content: "テストコメント1",
        createdAt: "2023-01-01T00:00:00Z",
        user: {
          name: "テストユーザー1",
          userImage: null
        }
      }
    ]
  } as PostFragment & { id: string };

  const mockPostWithoutThumbnail = {
    ...mockPost,
    thumbnailUrl: null
  };

  const mockUser = {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    userImage: null
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ログイン中のユーザーに対して投稿内容が正しく表示されること", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    render(await PostContent({ post: mockPost }));

    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    expect(screen.getByText("← 戻る")).toBeInTheDocument();
    expect(screen.getByTestId("main-title")).toBeInTheDocument();
    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByTestId("formatted-date")).toBeInTheDocument();
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
    expect(screen.getByTestId("comment-list")).toBeInTheDocument();
    expect(screen.getByText("コメント数: 1")).toBeInTheDocument();
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    expect(screen.getByText("投稿ID: 1, ログイン状態: ログイン中")).toBeInTheDocument();
  });

  it("未ログインユーザーに対して投稿内容が正しく表示されること", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    render(await PostContent({ post: mockPost }));

    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    expect(screen.getByText("投稿ID: 1, ログイン状態: 未ログイン")).toBeInTheDocument();
  });

  it("サムネイルがない場合、サムネイル要素が表示されないこと", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    render(await PostContent({ post: mockPostWithoutThumbnail }));

    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
  });
});
