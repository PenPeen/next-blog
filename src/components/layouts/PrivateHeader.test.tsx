import { render, screen } from '@testing-library/react'
import PrivateHeader from './PrivateHeader'

jest.mock('@/components/search/SearchBox', () => {
  return function MockSearchBox() {
    return <div data-testid="search-box">SearchBox</div>
  }
})

describe('PrivateHeader', () => {
  describe('初期状態', () => {
    it('コンテンツが適切に表示されること', () => {
      render(<PrivateHeader />)

      const logo = screen.getByAltText('PenBlog Logo')
      expect(logo).toBeInTheDocument()

      const title = screen.getByText('PenBlog')
      expect(title).toBeInTheDocument()

      const loginButton = screen.getByText('ログアウト')
      expect(loginButton).toBeInTheDocument()
    })
  })
})
