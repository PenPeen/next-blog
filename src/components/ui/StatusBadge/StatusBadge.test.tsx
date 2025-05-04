import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../posts/StatusBadge";

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
});
