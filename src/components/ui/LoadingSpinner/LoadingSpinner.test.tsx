import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './index';

describe('Loading', () => {
  it('renders the loading component', () => {
    const { container } = render(<LoadingSpinner />);

    expect(container).toBeInTheDocument();

    const spinnerElement = container.querySelector('div[class*="spinner"]');
    expect(spinnerElement).toBeInTheDocument();

    const loadingContainer = container.querySelector('div[class*="loadingContainer"]');
    expect(loadingContainer).toBeInTheDocument();
  });

  it('exposes a status role with a loading message for screen readers', () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole('status')).toHaveTextContent('読み込み中');
  });
});
