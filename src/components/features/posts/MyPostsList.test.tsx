import { render, screen } from "@testing-library/react";
import MyPostsList from "./MyPostsList";

describe('MyPostsList', () => {
  it('初期表示', () => {
    render(<MyPostsList />);
    expect(screen.getByText('記事一覧')).toBeInTheDocument();
  });

  // TODO: 記事がない場合のテストを追加する
});
