import { render, screen } from '@testing-library/react'
import PublicHeader from './PublicHeader'
import { getCurrentUser } from '@/app/(auth)/fetcher'

jest.mock('@/components/search/SearchBox', () => {
  return function MockSearchBox() {
    return <div data-testid="search-box">SearchBox</div>
  }
})

jest.mock('@/app/(auth)/fetcher', () => ({
  getCurrentUser: jest.fn()
}))

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

    it('マイページボタンが表示されること', async () => {
      render(await PublicHeader())

      const myPageButton = screen.getByText('マイページ')
      expect(myPageButton).toBeInTheDocument()
    })
  })
})
