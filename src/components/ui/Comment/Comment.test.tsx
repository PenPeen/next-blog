import { render, screen } from "@testing-library/react";
import Comment from ".";
import { Comment as CommentType } from "@/app/graphql/generated";

jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn(content => {
      return content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '');
    })
  }
}));

jest.mock('@/components/ui/DateFormatter', () => ({
  __esModule: true,
  default: function MockFormattedDate() {
    return <div data-testid="formatted-date">2023-01-01</div>;
  }
}));

describe('Comment', () => {
  const mockComment: CommentType = {
    id: '1',
    content: 'テストコメント',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    user: {
      id: '1',
      name: 'テストユーザー',
      email: 'test@example.com',
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
  };

  it('コメントが正しく表示されること', () => {
    render(<Comment comment={mockComment} />);

    expect(screen.getByTestId('comment-item')).toBeInTheDocument();
    expect(screen.getByText('テストコメント')).toBeInTheDocument();
    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-date')).toBeInTheDocument();
  });

  it('HTMLタグを含むコメントが安全にサニタイズされること', () => {
    const commentWithHtml: CommentType = {
      ...mockComment,
      content: '<script>alert("XSS");</script><b>太字テキスト</b><a href="javascript:alert(1)">リンク</a>'
    };

    render(<Comment comment={commentWithHtml} />);

    expect(screen.getByText('太字テキストリンク')).toBeInTheDocument();

    const commentContent = screen.getByTestId('comment-item').textContent;
    expect(commentContent).not.toContain('<script>');
    expect(commentContent).not.toContain('<b>');
    expect(commentContent).not.toContain('<a href=');
  });
});
