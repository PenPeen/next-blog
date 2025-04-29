import { render, screen } from "@testing-library/react";
import { MyPostItem } from "./MyPostItem";

jest.mock('@/components/features/posts/StatusBadge', () => ({
  StatusBadge: function MockStatusBadge() {
    return <div>公開ステータス</div>;
  }
}));

describe('MyPostItem', () => {
  describe('初期表示', () => {
    it('publishedの場合', () => {
      render(
        <MyPostItem
          post={
            {
              id: 1,
              title: '初めてのブログ記事',
              published: true,
              userId: 1,
              content: '初めての記事',
              thumbnailUrl: 'https://via.placeholder.com/150',
              createdAt: '2021-01-01',
              updatedAt: '2021-01-01'
            }
          }
        />
      );

      expect(screen.getByText('初めてのブログ記事')).toBeInTheDocument();
    });

    it('draftの場合', () => {
      render(
        <MyPostItem
          post={
            {
              id: 1,
              title: '初めてのブログ記事',
              published: false,
              userId: 1,
              content: '初めての記事',
              thumbnailUrl: 'https://via.placeholder.com/150',
              createdAt: '2021-01-01',
              updatedAt: '2021-01-01'
            }
          }
        />
      );

      expect(screen.getByText('初めてのブログ記事')).toBeInTheDocument();
    });
  });
});
