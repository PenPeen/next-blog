import { render, screen } from "@testing-library/react"
import UserDropDownMenu from "."
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { User } from "@/app/graphql";


jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue("/"),
}));

describe("UserDropDownMenu", () => {
  const user = {
    id: "1",
    name: "test",
    email: "test@example.com",
  }

  describe("初期レンダリング", () => {
    it("アイコンのみが表示されている", () => {
      render(<UserDropDownMenu user={user as User} />)

      const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
      expect(menuButton).toBeInTheDocument();

      const logoutButton = screen.queryByText("ログアウト")
      expect(logoutButton).not.toBeInTheDocument();
    })
  })

  describe("メニューボタンをクリックした時", () => {
    it("メニューが表示される", async () => {
      render(<UserDropDownMenu user={user as User} />)

      const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
      const u = userEvent.setup();
      await u.click(menuButton)

      const myPageButton = screen.getByText("マイページ")
      expect(myPageButton).toBeInTheDocument();

      const logoutButton = screen.getByText("ログアウト")
      expect(logoutButton).toBeInTheDocument();
    })

    describe("/account 配下のページにいる場合", () => {
      beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue("/account");
      })

      it("TOPページへのリンクが表示されている", async () => {
        render(<UserDropDownMenu user={user as User} />)

        const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
        const u = userEvent.setup();
        await u.click(menuButton)

        const logoutButton = screen.getByText("TOPページ")
        expect(logoutButton).toBeInTheDocument();
      })
    })

    describe("メニュー表示後、メニュー以外の場所をクリックした時", () => {
      it("メニューが閉じる", async () => {
        render(
          <>
            <div data-testid="outside-element">Outside Element</div>
            <UserDropDownMenu user={user as User} />
          </>
        )

        const menuButton = screen.getByRole("button", { name: "ユーザーメニュー" })
        const u = userEvent.setup();
        await u.click(menuButton)

        const logoutButton = screen.getByText("ログアウト")
        expect(logoutButton).toBeInTheDocument();

        const outsideElement = screen.getByTestId("outside-element")
        await u.click(outsideElement)

        expect(screen.queryByText("ログアウト")).not.toBeInTheDocument();
      })
    })
  })
})
