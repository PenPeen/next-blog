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

  it('should render the card with titleSize', () => {
    render(<Card title="Card Title" description="Card Description" titleSize="large" />);
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass(`titleSize-large`);
  })

  it('should render the card with descriptionSize', () => {
    render(<Card title="Card Title" description="Card Description" descriptionSize="large" />);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass(`descriptionSize-large`);
  })
})
