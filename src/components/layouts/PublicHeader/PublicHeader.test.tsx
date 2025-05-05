import { render, screen } from '@testing-library/react'
import PublicHeader from '@/components/layouts/PublicHeader/PublicHeader'
import { getCurrentUser } from '@/fetcher'

jest.mock('@/components/ui/SearchBox', () => {
  return function MockSearchBox() {
    return <div data-testid="search-box">SearchBox</div>
  }
})

jest.mock('@/fetcher', () => ({
  getCurrentUser: jest.fn()
}))

jest.mock('@/components/ui/UserDropDownMenu', () => {
  return function MockUserDropDownMenu() {
    return <div data-testid="user-drop-down-menu">UserDropDownMenu</div>
  }
})

describe('PublicHeader', () => {
  describe('未ログイン状態', () => {
    beforeEach(() => {
      (getCurrentUser as jest.Mock).mockResolvedValue(null)
    })

    it('ログインボタンが表示されること', async () => {
      render(await PublicHeader())

      const loginButton = screen.getByText('ログイン')
      expect(loginButton).toBeInTheDocument()
    })
  })

  describe('ログイン状態', () => {
    beforeEach(() => {
      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })
    })

    it('ドロップダウンが表示されること', async () => {
      render(await PublicHeader())

      const userDropDownMenu = screen.getByText('UserDropDownMenu')
      expect(userDropDownMenu).toBeInTheDocument()
    })
  })
})
