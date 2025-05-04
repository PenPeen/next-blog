import { render, screen } from '@testing-library/react'
import PrivateHeader from '@/components/layouts/PrivateHeader/PrivateHeader'

jest.mock('@/components/layouts/LogoutButton/LogoutButton', () => {
  return function MockLogoutButton() {
    return <div data-testid="logout-button">LogoutButton</div>
  }
})

describe('PrivateHeader', () => {
  describe('初期状態', () => {
    it('コンテンツが適切に表示されること', async () => {
      render(await PrivateHeader())

      const logo = screen.getByAltText('PenBlog Logo')
      expect(logo).toBeInTheDocument()

      const title = screen.getByText('PenBlog')
      expect(title).toBeInTheDocument()
    })
  })
})
