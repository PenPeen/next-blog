import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/ui/StatusBadge";

describe('StatusBadge', () => {
  describe('初期表示', () => {
    it('publishedの場合', () => {
      render(<StatusBadge status="published" />);
      expect(screen.getByText('公開中')).toBeInTheDocument();
    });

    it('draftの場合', () => {
      render(<StatusBadge status="draft" />);
      expect(screen.getByText('下書き')).toBeInTheDocument();
    });
  });

  describe('CSSクラス適用', () => {
    it('publishedの場合の適切なクラスが適用されていること', () => {
      render(<StatusBadge status="published" />);
      const badge = screen.getByText('公開中');
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass('badge__published');
    });

    it('draftの場合の適切なクラスが適用されていること', () => {
      render(<StatusBadge status="draft" />);
      const badge = screen.getByText('下書き');
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass('badge__draft');
    });
  });

  describe('getStatusText関数', () => {
    it('全てのステータスタイプに対応して正しいテキストを表示すること', () => {
      // すべてのケースがテストされていることを確認
      const { rerender } = render(<StatusBadge status="published" />);
      expect(screen.getByText('公開中')).toBeInTheDocument();

      rerender(<StatusBadge status="draft" />);
      expect(screen.getByText('下書き')).toBeInTheDocument();
    });

    it('ステータスに対応するテキストが常に文字列であること', () => {
      // publishedの場合
      const { rerender } = render(<StatusBadge status="published" />);
      const publishedText = screen.getByText('公開中').textContent;
      expect(typeof publishedText).toBe('string');
      expect(publishedText).toBe('公開中');

      // draftの場合
      rerender(<StatusBadge status="draft" />);
      const draftText = screen.getByText('下書き').textContent;
      expect(typeof draftText).toBe('string');
      expect(draftText).toBe('下書き');
    });
  });
});
