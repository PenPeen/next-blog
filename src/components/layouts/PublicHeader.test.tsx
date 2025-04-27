import { render, screen } from '@testing-library/react'
import PublicHeader from './PublicHeader'

jest.mock('@/components/search/SearchBox', () => {
  return function MockSearchBox() {
    return <div data-testid="search-box">SearchBox</div>
  }
})

describe('PublicHeader', () => {
  describe('初期状態', () => {
    it('コンテンツが適切に表示されること', () => {
      render(<PublicHeader />)

      const logo = screen.getByAltText('PenBlog Logo')
      expect(logo).toBeInTheDocument()

      const title = screen.getByText('PenBlog')
      expect(title).toBeInTheDocument()

      const searchBox = screen.getByText('SearchBox')
      expect(searchBox).toBeInTheDocument()

      const loginButton = screen.getByText('ログイン')
      expect(loginButton).toBeInTheDocument()

      const registerButton = screen.getByText('登録')
      expect(registerButton).toBeInTheDocument()
    })
  })
})
