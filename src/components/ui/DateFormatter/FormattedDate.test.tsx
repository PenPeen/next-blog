import { render, screen } from "@testing-library/react"
import FormattedDate from "./FormattedDate"

describe('FormattedDate', () => {
  it('renders a date', () => {
    render(
      <FormattedDate date="2025-04-01" />
    );

    expect(screen.getByText('2025年4月1日')).toBeVisible();
  })
})
