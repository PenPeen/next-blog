import React from 'react';
import { render } from '@testing-library/react';
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
});
