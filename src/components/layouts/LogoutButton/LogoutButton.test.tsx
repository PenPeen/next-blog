import { render, screen, fireEvent } from "@testing-library/react"
import LogoutButton from "./LogoutButton"
import { useTransition } from "react"

// Server Actionsをモック
jest.mock('@/app/actions/auth', () => ({
  logout: jest.fn()
}))

// React hooksのモック
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: jest.fn().mockImplementation(() => [false, jest.fn()])
}))

describe('LogoutButton', () => {
  it('正しくレンダリングされる', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: /ログアウト/ })).toBeInTheDocument()
  })

  it('クリック時にサーバーアクションが呼ばれる', () => {
    const { logout } = jest.requireMock('@/app/actions/auth')
    const mockStartTransition = jest.fn((callback) => callback())
    ;(useTransition as jest.Mock).mockReturnValue([false, mockStartTransition])

    render(<LogoutButton />)

    fireEvent.click(screen.getByRole('button', { name: /ログアウト/ }))

    expect(mockStartTransition).toHaveBeenCalled()
    expect(logout).toHaveBeenCalled()
  })

  it('ログアウト中は非活性になる', () => {
    ;(useTransition as jest.Mock).mockReturnValue([true, jest.fn()])

    render(<LogoutButton />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('ログアウト中...')
  })
})
