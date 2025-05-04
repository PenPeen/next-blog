import { render, screen } from "@testing-library/react"
import MainTitle from "."

describe('MainTitle', () => {
  it('renders a heading', () => {
    render(
      <MainTitle>
        タイトル
      </MainTitle>
    );

    expect(screen.getByText('タイトル')).toBeVisible();
  })
})
