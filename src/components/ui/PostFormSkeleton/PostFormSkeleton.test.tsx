import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostFormSkeleton from '.';

describe('PostFormSkeleton', () => {
  it('renders correctly', () => {
    const { container } = render(<PostFormSkeleton />);

    // スケルトン要素が存在することを確認
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);

    // 主要なセクションが存在することを確認
    expect(container.querySelector('[class*="header"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="thumbnailContainer"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="content"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="actions"]')).toBeInTheDocument();
  });
});
