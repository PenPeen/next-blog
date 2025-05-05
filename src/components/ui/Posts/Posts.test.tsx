import { render, screen } from "@testing-library/react"
import Posts from "."
import { Post } from "@/app/graphql"

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>
  }
}))

jest.mock("@/components/ui/Card", () => ({
  __esModule: true,
  default: ({ title, description }: { title: string, description: string }) => {
    return (
      <div data-testid="card">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    )
  }
}))

describe('Posts', () => {
  const mockPosts: Post[] = [
    {
      id: "1",
      title: "テスト記事1",
      content: "テスト内容1",
      thumbnailUrl: "/test1.jpg",
      published: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      userId: 1,
      user: {
        id: "1",
        name: "テストユーザー1",
        email: "test1@example.com",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      }
    },
    {
      id: "2",
      title: "テスト記事2",
      content: "テスト内容2",
      thumbnailUrl: "/test2.jpg",
      published: true,
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z",
      userId: 2,
      user: {
        id: "2",
        name: "テストユーザー2",
        email: "test2@example.com",
        createdAt: "2023-01-02T00:00:00Z",
        updatedAt: "2023-01-02T00:00:00Z",
      }
    }
  ]

  it('should render posts correctly', () => {
    render(<Posts posts={mockPosts} />)

    expect(screen.getByText('テスト記事1')).toBeInTheDocument()
    expect(screen.getByText('テスト内容1')).toBeInTheDocument()
    expect(screen.getByText('テスト記事2')).toBeInTheDocument()
    expect(screen.getByText('テスト内容2')).toBeInTheDocument()

    const cards = screen.getAllByTestId('card')
    expect(cards).toHaveLength(2)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/posts/1')
    expect(links[1]).toHaveAttribute('href', '/posts/2')
  })

  it('should render empty state when no posts', () => {
    render(<Posts posts={[]} />)

    const cards = screen.queryAllByTestId('card')
    expect(cards).toHaveLength(0)
  })
})
