import { render, screen } from "@testing-library/react";
import MyPostsList from "./MyPostsList";
import { getMyPosts } from "@/app/(private)/account/fetcher";

jest.mock('@/app/(private)/account/fetcher', () => ({
  getMyPosts: jest.fn()
}));

describe('初期表示', () => {
  beforeEach(() => {
    (getMyPosts as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        posts: [
          {
            id: 1,
            title: 'テストタイトル1',
            published: true,
          },
        ],
      }),
    });
  });

  it('記事の内容が表示される', async () => {
    render(await MyPostsList({ currentPage: 1, perPage: 10 }));
    expect(screen.getByText('テストタイトル1')).toBeInTheDocument();
  });
});

describe('記事が存在しない場合', () => {
  beforeEach(() => {
    (getMyPosts as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        posts: [],
      }),
    });
  });

  it('記事がありません...と表示される', async () => {
    render(await MyPostsList({ currentPage: 1, perPage: 10 }));
    expect(screen.getByText('記事がありません。新しい記事を作成しましょう。')).toBeInTheDocument();
  });
});
