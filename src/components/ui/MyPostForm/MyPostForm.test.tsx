import React from 'react';
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apolloClient } from '@/app/graphql/apollo-client';
import MyPostForm from '.';
import { Post } from '@/app/graphql';

// 型定義を追加
type DropdownOption = {
  value: string;
  label: string;
};

jest.mock('@/app/graphql/apollo-client', () => ({
  apolloClient: {
    mutate: jest.fn()
  }
}));

jest.mock('@/components/ui/StatusBadge', () => ({
  StatusBadge: () => <div data-testid="status-badge">Status Badge</div>
}));

jest.mock('@/components/ui/FormInput', () => {
  return function MockFormInput({ label, name }: { label: string, name: string }) {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input id={name} aria-label={label} />
      </div>
    );
  };
});

jest.mock('@/components/ui/FormDropdown', () => {
  return function MockFormDropdown({ label, name, options }: { label: string, name: string, options: DropdownOption[] }) {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <select
          id={name}
          aria-label={label}
          data-testid={`select-${name}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('@/components/ui/Button', () => {
  return function MockButton({ children, buttonType }: { children: React.ReactNode, buttonType: "button" | "submit" | "reset" }) {
    return (
      <button
        type={buttonType}
        role="button"
      >
        {children}
      </button>
    );
  };
});

const mockPost: Partial<Post> = {
  id: '123',
  title: 'Test Title',
  content: 'Test Content',
  published: false
};

describe('MyPostForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apolloClient.mutate as jest.Mock).mockResolvedValue({
      data: {
        updatePost: {
          post: {
            id: '123',
            title: 'Updated Title',
            content: 'Updated Content',
            published: true
          }
        }
      }
    });
  });

  it('renders form components correctly', () => {
    render(<MyPostForm post={mockPost as Post} />);

    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('公開状態')).toBeInTheDocument();
    expect(screen.getByTestId('content-textarea')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('submits form data correctly', async () => {
    const user = userEvent.setup();
    render(<MyPostForm post={mockPost as Post} />);

    const contentTextarea = screen.getByTestId('content-textarea');
    const submitButton = screen.getByRole('button');

    await act(async () => {
      await user.type(contentTextarea, ' Updated Content');
      await user.click(submitButton);
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(apolloClient.mutate).toHaveBeenCalledWith(expect.objectContaining({
      variables: {
        input: {
          postInput: {
            id: '123',
            title: 'Test Title',
            content: 'Test Content Updated Content', // ユーザーが追加したテキストを含む
            published: false
          }
        }
      }
    }));
  });

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    render(<MyPostForm post={mockPost as Post} />);

    const submitButton = screen.getByRole('button');

    await act(async () => {
      await user.click(submitButton);
    });

    await screen.findByText('投稿を更新しました');

    expect(screen.getByText('投稿を更新しました')).toBeInTheDocument();
  });
});
