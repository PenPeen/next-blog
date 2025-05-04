import { render, screen } from "@testing-library/react"
import Button from "."

describe('Button', () => {
  it('should render the button with text', () => {
    render(<Button>TEST Button</Button>)
    expect(screen.getByText('TEST Button')).toBeInTheDocument();
  })

  it('should call handleClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button handleClick={handleClick}>クリック</Button>)
    screen.getByText('クリック').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when isDisabled is true', () => {
    render(<Button isDisabled>無効ボタン</Button>)
    expect(screen.getByText('無効ボタン')).toBeDisabled()
  })

  it('should have danger class when type is danger', () => {
    render(<Button type="danger">Danger</Button>);
    const button = screen.getByRole('button', { name: 'Danger'});
    expect(button).toHaveClass('button__danger');
  })
})
