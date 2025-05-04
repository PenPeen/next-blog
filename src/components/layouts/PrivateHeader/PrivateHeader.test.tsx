import { render, screen } from '@testing-library/react'
import PrivateHeader from '@/components/layouts/PrivateHeader/PrivateHeader'

jest.mock('@/components/ui/UserDropDownMenu', () => {
  return function MockUserDropDownMenu() {
    return <div data-testid="user-drop-down-menu">UserDropDownMenu</div>
  }
})

jest.mock('@/app/(auth)/fetcher', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    id: '1',
    name: 'test',
    email: 'test@example.com',
  })
}));

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
