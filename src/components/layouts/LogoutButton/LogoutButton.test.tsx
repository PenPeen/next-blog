import { render, screen } from "@testing-library/react"
import LogoutButton from "./LogoutButton"

jest.mock('@/hooks/auth/useAuth', () => {
  return {
    useAuth: () => ({
      logout: jest.fn(),
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 1,
        name: 'John Doe',
      },
    }),
  }
})

describe('LogoutButton', () => {

  describe('初期表示', () => {
    it('ログアウトボタンが表示される', () => {
      render(<LogoutButton />)
      expect(screen.getByText('ログアウト')).toBeInTheDocument()
    })
  })
})
