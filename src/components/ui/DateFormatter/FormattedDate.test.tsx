import { render, screen } from "@testing-library/react"
import FormattedDate from "."

describe('FormattedDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-04-10T12:00:00Z'));
  })

  afterEach(() => {
    jest.useRealTimers();
  })

  it('renders a date', () => {
    render(
      <FormattedDate date="2025-04-01T12:00:00Z" />
    );

    expect(screen.getByText('2025年4月1日')).toBeVisible();
  })

  it('renders hours for a post within a day', () => {
    render(
      <FormattedDate date="2025-04-10T09:00:00Z" />
    );

    expect(screen.getByText('3時間前')).toBeVisible();
  })

  it('renders days for a post within a week', () => {
    render(
      <FormattedDate date="2025-04-08T12:00:00Z" />
    );

    expect(screen.getByText('2日前')).toBeVisible();
  })

  it('renders a placeholder for a post just published', () => {
    render(
      <FormattedDate date="2025-04-10T11:30:00Z" />
    );

    expect(screen.getByText('たった今')).toBeVisible();
  })

  it('falls back to the absolute date exactly at the seven day boundary', () => {
    render(
      <FormattedDate date="2025-04-03T12:00:00Z" />
    );

    expect(screen.getByText('2025年4月3日')).toBeVisible();
  })

  it('falls back to the absolute date for a future post', () => {
    render(
      <FormattedDate date="2025-04-20T12:00:00Z" />
    );

    expect(screen.getByText('2025年4月20日')).toBeVisible();
  })
})
