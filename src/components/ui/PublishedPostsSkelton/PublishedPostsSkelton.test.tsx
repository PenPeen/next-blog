import { render } from "@testing-library/react";
import PublishedPostsSkelton from ".";

describe('PublishedPostsSkelton', () => {
  it('Skeltonが表示されること', () => {
    const { container } = render(<PublishedPostsSkelton />);
    expect(container.firstChild).toHaveClass('skeletonCard');
  });
});
