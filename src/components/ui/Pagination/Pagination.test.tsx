import { render, screen } from "@testing-library/react";
import { Pagination } from ".";

describe('Pagination', () => {
  it('初期状態の検証', () => {
    render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={1} />);

    const paginationNav = screen.getByRole('navigation', { name: 'Pagination' });
    const previousButton = screen.getByRole('link', { name: 'Previous page' });
    const nextButton = screen.getByRole('link', { name: 'Next page' });
    const currentPageLink = screen.getByRole('link', { current: 'page' });

    expect(paginationNav).toBeVisible();
    expect(previousButton).toBeVisible();
    expect(nextButton).toBeVisible();
    expect(screen.getByText('全 100 件中 1 - 10 件表示')).toBeVisible();
    expect(currentPageLink).toHaveTextContent('1');
    expect(previousButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });

  describe('ボタンの活性状態確認', () => {
    it('最初のページでは「戻る」ボタンが非活性であること', () => {
      render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={1} />);

      const previousButton = screen.getByRole('link', { name: 'Previous page' });
      expect(previousButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('最後のページでは「次へ」ボタンが非活性であること', () => {
      render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={10} />);

      const nextButton = screen.getByRole('link', { name: 'Next page' });
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('中間のページでは「戻る」ボタンと「次へ」ボタンが活性であること', () => {
      render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={5} />);

      const prevButton = screen.getByRole('link', { name: 'Previous page' });
      const nextButton = screen.getByRole('link', { name: 'Next page' });
      expect(prevButton).toHaveAttribute('aria-disabled', 'false');
      expect(nextButton).toHaveAttribute('aria-disabled', 'false');
    });
  })

  describe('ページ番号の表示確認', () => {
    it('ページ数が7以下の場合はページ番号が1から7まで表示されること', () => {
      render(<Pagination totalCount={70} limitValue={10} totalPages={7} currentPage={1} />);

      for (let i = 1; i <= 7; i++) {
        const pageNumber = String(i);
        expect(screen.getByRole('link', { name: pageNumber })).toBeInTheDocument();
      }

      const dots = screen.queryAllByText('…');
      expect(dots).toHaveLength(0);
    });

    it('ページ数が8より多いかつ、現在のページが3未満', () => {
      render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={2} />);

      [1, 2, 3, 4, 9, 10].forEach(num => {
        const pageNumber = String(num);
        expect(screen.getByRole('link', { name: pageNumber })).toBeInTheDocument();
      });

      const dots = screen.queryAllByText('…');
      expect(dots).toHaveLength(1);
    });

    it('ページ数が8より多いかつ、最後のページから3ページ以内', () => {
      render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={8} />);

      [1, 2, 7, 8, 9, 10].forEach(num => {
        const pageNumber = String(num);
        expect(screen.getByRole('link', { name: pageNumber })).toBeInTheDocument();
      });

      const dots = screen.queryAllByText('…');
      expect(dots).toHaveLength(1);
    });

    it('上記以外', () => {
      render(<Pagination totalCount={100} limitValue={10} totalPages={10} currentPage={5} />);

      [1, 4, 5, 6, 10].forEach(num => {
        const pageNumber = String(num);
        expect(screen.getByRole('link', { name: pageNumber })).toBeInTheDocument();
      });

      const dots = screen.queryAllByText('…');
      expect(dots).toHaveLength(2);
    });
  })
});
