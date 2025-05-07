import { render, screen } from "@testing-library/react"
import LogoutButton from "./LogoutButton"

jest.mock('@/actions/logout', () => {
  return {
    logout: jest.fn(),
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
