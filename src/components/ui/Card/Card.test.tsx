import { render, screen } from "@testing-library/react"
import Card from "."

describe('Card', () => {
  it('should render the card', () => {
    render(<Card title="Card Title" description="Card Description" />);
    expect(screen.getByText('Card Title')).toBeVisible();
    expect(screen.getByText('Card Description')).toBeVisible();
  })

  it('should render the card with image', () => {
    render(<Card title="Card Title" description="Card Description" img="https://placehold.jp/1920x1080.png" />);
    const img = screen.getByAltText('Card Title');
    expect(img).toBeVisible();
  })

  it('should render the card with imageAspectRatio', () => {
    render(<Card title="Card Title" description="Card Description" img="https://placehold.jp/1920x1080.png" imageAspectRatio="4/3" />);
    const imgContainer = screen.getByAltText('Card Title').parentElement!;
    expect(imgContainer).toHaveClass(`aspectRatio-4-3`);
  })

  it('should render the card with imageAspectRatio that is not supported', () => {
    render(<Card title="Card Title" description="Card Description" img="https://placehold.jp/1920x1080.png" imageAspectRatio="invalid" />);
    const imgContainer = screen.getByAltText('Card Title').parentElement!;
    expect(imgContainer).toHaveClass('imageContainer');
    expect(imgContainer).toHaveClass('aspectRatio-invalid');
  })

  it('should render the card with titleSize', () => {
    render(<Card title="Card Title" description="Card Description" titleSize="large" />);
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass(`titleSize-large`);
  })

  it('should render the card with titleSize that is not supported', () => {
    render(<Card title="Card Title" description="Card Description" titleSize="invalid" />);
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass('title');
    expect(title).toHaveClass('titleSize-invalid');
  })

  it('should render the card with descriptionSize', () => {
    render(<Card title="Card Title" description="Card Description" descriptionSize="large" />);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass(`descriptionSize-large`);
  })

  it('should render the card with descriptionSize that is not supported', () => {
    render(<Card title="Card Title" description="Card Description" descriptionSize="invalid" />);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass('description');
    expect(description).toHaveClass('descriptionSize-invalid');
  })

  it('should render the card with post variant', () => {
    render(<Card title="Card Title" description="Card Description" variant="post" />);
    const card = screen.getByText('Card Title').closest('div.card');
    expect(card).toHaveClass('postVariant');
  })

  it('should render the card with default variant', () => {
    render(<Card title="Card Title" description="Card Description" variant="default" />);
    const card = screen.getByText('Card Title').closest('div.card');
    expect(card).not.toHaveClass('postVariant');
  })

  it('should render the card with children', () => {
    render(
      <Card title="Card Title" description="Card Description">
        <div data-testid="child-element">Child Content</div>
      </Card>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeVisible();
  })

  it('should render the card with maxLines between 1 and 5', () => {
    render(<Card title="Card Title" description="Card Description" maxLines={3} />);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass('lineClamp3');
  })

  it('should render the card with maxLines outside valid range', () => {
    render(<Card title="Card Title" description="Card Description" maxLines={6} />);
    const description = screen.getByText('Card Description');
    expect(description).not.toHaveClass('lineClamp6');
  })

  it('should render the card with maxLines of 0', () => {
    render(<Card title="Card Title" description="Card Description" maxLines={0} />);
    const description = screen.getByText('Card Description');
    expect(description).not.toHaveClass(/lineClamp/);
  })

  it('should render the card with negative maxLines', () => {
    render(<Card title="Card Title" description="Card Description" maxLines={-1} />);
    const description = screen.getByText('Card Description');
    expect(description).not.toHaveClass(/lineClamp/);
  })

  it('should render the card with maxLines of 1', () => {
    render(<Card title="Card Title" description="Card Description" maxLines={1} />);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass('lineClamp1');
  })

  it('should render the card with maxLines of 5', () => {
    render(<Card title="Card Title" description="Card Description" maxLines={5} />);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass('lineClamp5');
  })

  it('should render the card with titleMaxLines', () => {
    render(<Card title="Card Title" description="Card Description" titleMaxLines={true} />);
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass('titleLineClamp2');
  })

  it('should render the card without image', () => {
    render(<Card title="Card Title" description="Card Description" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  })

  it('should render the card without title', () => {
    render(<Card description="Card Description" />);
    expect(screen.queryByText('Card Title')).not.toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeVisible();
  })

  it('should render the card without description', () => {
    render(<Card title="Card Title" />);
    expect(screen.getByText('Card Title')).toBeVisible();
    expect(screen.queryByText('Card Description')).not.toBeInTheDocument();
  })

  it('should render empty card with only children', () => {
    render(
      <Card>
        <div data-testid="child-element">Child Content</div>
      </Card>
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('Card Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Card Description')).not.toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  })

  it('should render the card with unoptimized image', () => {
    render(<Card title="Card Title" description="Card Description" img="https://placehold.jp/1920x1080.png" unoptimized={true} />);
    const img = screen.getByAltText('Card Title');
    expect(img).toBeInTheDocument();
  })

  it('should handle img alt text when title is not provided', () => {
    render(<Card description="Card Description" img="https://placehold.jp/1920x1080.png" />);
    const images = document.querySelectorAll('img');
    const imgWithEmptyAlt = Array.from(images).find(img => img.alt === '');
    expect(imgWithEmptyAlt).toBeInTheDocument();
  })
})
