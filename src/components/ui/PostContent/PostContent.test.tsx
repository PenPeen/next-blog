import { render, screen } from "@testing-library/react";
import PostContent from ".";
import { PostFragment, User } from "@/app/graphql/generated";
import { Comment } from "@/app/graphql/generated";
import { getCurrentUser, getPost } from "@/fetcher";

jest.mock("@/fetcher", () => ({
  getCurrentUser: jest.fn(),
  getPost: jest.fn(),
}));

jest.mock("@/components/ui/BackButton", () => {
  return function MockBackButton({ children }: { children: React.ReactNode }) {
    return <div data-testid="back-button">{children}</div>;
  }
});

jest.mock("@/components/ui/MainTitle", () => {
  return function MockMainTitle({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-title">{children}</div>;
  }
});

jest.mock("@/components/ui/DateFormatter", () => {
  return function MockFormattedDate() {
    return <div data-testid="formatted-date">2023-01-01</div>;
  }
});

jest.mock("@/components/ui/CommentList", () => {
  return function MockCommentList({ comments }: { comments: Comment[] }) {
    return (
      <div data-testid="comment-list">
        コメント数: {comments.length}
      </div>
    );
  }
});

jest.mock("@/components/ui/CommentListContainer", () => {
  return function MockCommentListContainer({ postId }: { postId: string }) {
    return (
      <div data-testid="comment-list-container">
        投稿ID: {postId} のコメント一覧
      </div>
    );
  }
});

jest.mock("@/components/ui/CommentForm", () => {
  return function MockCommentForm({ postId, currentUser }: { postId: string, currentUser: User | null }) {
    return (
      <div data-testid="comment-form">
        投稿ID: {postId}, ログイン状態: {currentUser ? 'ログイン中' : '未ログイン'}
      </div>
    );
  }
});

jest.mock("next/image", () => {
  return function MockImage({ src, alt }: { src: string, alt: string }) {
    return <img src={src} alt={alt} data-testid="next-image" />; // eslint-disable-line
  }
});

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

  const mockCommentData = {
    postCommentsCursor: {
      edges: [
        {
          node: {
            id: 'comment1',
            content: 'テストコメント1',
            createdAt: '2023-01-01T00:00:00Z',
            user: {
              name: 'テストユーザー1',
              userImage: null
            }
          }
        }
      ],
      pageInfo: {
        endCursor: 'endCursor123',
        hasNextPage: true
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getPost as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockCommentData)
    });
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
    expect(screen.getByTestId("comment-list-container")).toBeInTheDocument();
    expect(screen.getByText("投稿ID: 1 のコメント一覧")).toBeInTheDocument();
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    expect(screen.getByText("投稿ID: 1, ログイン状態: ログイン中")).toBeInTheDocument();
  });

  it("未ログインユーザーに対して投稿内容が正しく表示されること", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    render(await PostContent({ post: mockPost }));

    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    expect(screen.getByTestId("main-title")).toBeInTheDocument();
    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    expect(screen.getByText("投稿ID: 1, ログイン状態: 未ログイン")).toBeInTheDocument();
  });

  it("サムネイルがない場合、サムネイル要素が表示されないこと", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    render(await PostContent({ post: mockPostWithoutThumbnail }));

    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
    expect(screen.getByTestId("main-title")).toBeInTheDocument();
    expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    expect(screen.getByText("テスト内容")).toBeInTheDocument();
  });
});
