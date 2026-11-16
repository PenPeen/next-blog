import { render, screen } from "@testing-library/react"
import TableOfContents from "."

describe('TableOfContents', () => {
  it('見出しごとに、その見出しの id へのリンクを表示すること', () => {
    render(
      <TableOfContents
        headings={[
          { type: 'heading', id: 'heading-1', level: 1, text: 'はじめに' },
          { type: 'heading', id: 'heading-2', level: 2, text: '詳細' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: '目次' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'はじめに' })).toHaveAttribute('href', '#heading-1');
    expect(screen.getByRole('link', { name: '詳細' })).toHaveAttribute('href', '#heading-2');
  })

  it('見出しが無いときは何も表示しないこと', () => {
    const { container } = render(<TableOfContents headings={[]} />);

    expect(container).toBeEmptyDOMElement();
  })
})
