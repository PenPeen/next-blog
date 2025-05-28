import { render, screen } from "@testing-library/react";
import CommentList from ".";
import { Comment as CommentType } from "@/app/graphql/generated";

jest.mock('@/components/ui/Comment', () => ({
  __esModule: true,
  default: function MockComment({ comment }: { comment: CommentType }) {
    return <div data-testid={`comment-${comment.id}`}>{comment.content}</div>;
  }
}));

describe('CommentList', () => {
  const mockComments: CommentType[] = [
    {
      id: '1',
      content: 'テストコメント1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      user: {
        id: '1',
        name: 'テストユーザー1',
        email: 'test1@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        userImage: null,
        posts: null
      },
      post: {
        id: '1',
        title: 'テスト投稿',
        content: 'テスト内容',
        published: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        thumbnailUrl: null,
        user: {
          id: '1',
          name: 'テストユーザー',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          userImage: null,
          posts: null
        },
        comments: []
      }
    },
    {
      id: '2',
      content: 'テストコメント2',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      user: {
        id: '2',
        name: 'テストユーザー2',
        email: 'test2@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        userImage: null,
        posts: null
      },
      post: {
        id: '1',
        title: 'テスト投稿',
        content: 'テスト内容',
        published: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        thumbnailUrl: null,
        user: {
          id: '1',
          name: 'テストユーザー',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          userImage: null,
          posts: null
        },
        comments: []
      }
    }
  ];

  it('コメントリストが正しく表示されること', () => {
    render(<CommentList comments={mockComments} />);

    expect(screen.getByTestId('comment-list')).toBeInTheDocument();
    expect(screen.getByText('コメント (2)')).toBeInTheDocument();
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
    expect(screen.getByText('テストコメント1')).toBeInTheDocument();
    expect(screen.getByText('テストコメント2')).toBeInTheDocument();
  });

  it('コメントがない場合にメッセージが表示されること', () => {
    render(<CommentList comments={[]} />);

    expect(screen.getByTestId('no-comments')).toBeInTheDocument();
    expect(screen.getByText('まだコメントはありません。')).toBeInTheDocument();
  });
});
