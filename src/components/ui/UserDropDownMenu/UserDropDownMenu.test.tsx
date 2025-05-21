import { render, screen } from "@testing-library/react"
import UserDropDownMenu from "."
import userEvent from "@testing-library/user-event"
import { usePathname } from "next/navigation"
import { User } from "@/app/graphql"
import { logout } from "@/actions/logout"

jest.mock('@/actions/logout', () => ({
  logout: jest.fn()
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} alt={props.alt} />
  }
}))

describe("UserDropDownMenu", () => {
  const mockUser = {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    userImage: {
      profile: "/test-image.jpg"
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  } as User

  test("初期状態ではメニューは閉じている", () => {
    render(<UserDropDownMenu user={mockUser} />)

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    expect(menuButton).toBeInTheDocument()

    const logoutButton = screen.queryByRole("button", { name: "ログアウト" })
    expect(logoutButton).not.toBeInTheDocument()
  })

  test("ボタンをクリックするとメニューが開き、ユーザー情報が表示される", async () => {
    render(<UserDropDownMenu user={mockUser} />)

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    const logoutButton = screen.getByRole("button", { name: "ログアウト" })
    expect(logoutButton).toBeInTheDocument()

    expect(screen.getByText("テストユーザー")).toBeInTheDocument()
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
  })

  test("/account 以外のパス ではマイページリンクが表示される", async () => {
    (usePathname as jest.Mock).mockReturnValue("/")

    render(<UserDropDownMenu user={mockUser} />)

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    const myPageLink = screen.getByRole("link", { name: "マイページ" })
    expect(myPageLink).toBeInTheDocument()
    expect(myPageLink).toHaveAttribute('href', '/account')

    expect(screen.queryByRole("link", { name: "TOPページ" })).not.toBeInTheDocument()
  })

  test("/account パスではTOPページリンクが表示される", async () => {
    (usePathname as jest.Mock).mockReturnValue("/account")

    render(<UserDropDownMenu user={mockUser} />)

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    const topPageLink = screen.getByRole("link", { name: "TOPページ" })
    expect(topPageLink).toBeInTheDocument()
    expect(topPageLink).toHaveAttribute('href', '/')

    expect(screen.queryByRole("link", { name: "マイページ" })).not.toBeInTheDocument()
  })

  test("プロフィールリンクが常に表示される", async () => {
    render(<UserDropDownMenu user={mockUser} />)

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    const profileLink = screen.getByRole("link", { name: "プロフィール" })
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute('href', '/account/profile')
  })

  test("ログアウトボタンをクリックするとlogout関数が呼ばれる", async () => {
    render(<UserDropDownMenu user={mockUser} />)

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    const logoutButton = screen.getByRole("button", { name: "ログアウト" })
    await user.click(logoutButton)

    expect(logout).toHaveBeenCalledTimes(1)
  })

  test("メニュー外をクリックするとメニューが閉じる", async () => {
    render(
      <>
        <div data-testid="outside">Outside element</div>
        <UserDropDownMenu user={mockUser} />
      </>
    )

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    expect(screen.getByRole("button", { name: "ログアウト" })).toBeInTheDocument()

    const outsideElement = screen.getByTestId("outside")
    await user.click(outsideElement)

    expect(screen.queryByRole("button", { name: "ログアウト" })).not.toBeInTheDocument()
  })

  test("ユーザー画像がない場合はデフォルト画像が表示される", async () => {
    const userWithoutImage = {
      id: "2",
      name: "ノーイメージユーザー",
      email: "no-image@example.com",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z"
    } as User

    render(<UserDropDownMenu user={userWithoutImage} />)

    const userIcon = screen.getByAltText("ユーザーメニュー")
    expect(userIcon).toHaveAttribute("src", "/user.gif")

    const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
    const user = userEvent.setup()
    await user.click(menuButton)

    const userAvatar = screen.getByAltText("ノーイメージユーザー")
    expect(userAvatar).toHaveAttribute("src", "/user.gif")
  })
})
