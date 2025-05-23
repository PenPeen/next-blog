import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from ".";
import React from "react";
import { createPortal } from "react-dom";

jest.mock("react-dom", () => {
  return {
    ...jest.requireActual("react-dom"),
    createPortal: jest.fn((element, _node) => {
      return element;
    }),
  };
});

describe("初期状態", () => {
  const user = userEvent.setup({ delay: null });

  it("isOpenがfalseの場合、モーダルは表示されない", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={false} onClose={onClose}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    expect(screen.queryByText("モーダルコンテンツ")).not.toBeInTheDocument();
  });

  it("isOpenがtrueの場合、モーダルが表示される", () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    expect(screen.getByText("モーダルコンテンツ")).toBeInTheDocument();
    expect(createPortal).toHaveBeenCalled();

    const overlay = container.querySelector('[data-testid="modal-overlay"]');
    expect(overlay).toHaveClass('open');
  });

  it("titleが提供されている場合、タイトルが表示される", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="テストタイトル">
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    expect(screen.getByText("テストタイトル")).toBeInTheDocument();
  });

  describe("閉じるボタン", () => {
    it("閉じるボタンをクリックしてonCloseが呼ばれると、モーダルが非表示になる", async () => {
      const handleClose = jest.fn();
      const TestModalComponent = () => {
        const [isOpen, setIsOpen] = React.useState(true);
        handleClose.mockImplementation(() => setIsOpen(false));

        return (
          <Modal isOpen={isOpen} onClose={handleClose}>
            <div>モーダルコンテンツ</div>
          </Modal>
        );
      };

      render(<TestModalComponent />);

      await user.click(screen.getByLabelText("閉じる"));
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("モーダルコンテンツ")).not.toBeInTheDocument();
    });
  });

  it("オーバーレイクリックでモーダルが非表示になる", async () => {
    const handleClose = jest.fn();
    const TestModalComponent = () => {
      const [isOpen, setIsOpen] = React.useState(true);
      handleClose.mockImplementation(() => setIsOpen(false));

      return (
        <Modal isOpen={isOpen} onClose={handleClose}>
          <div>モーダルコンテンツ</div>
        </Modal>
      );
    };

    render(<TestModalComponent />);

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);
    expect(screen.queryByText("モーダルコンテンツ")).not.toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("オーバーレイクリックでモーダルが非表示にならない", async () => {
    const handleClose = jest.fn();
    const TestModalComponent = () => {
      const [isOpen, setIsOpen] = React.useState(true);
      handleClose.mockImplementation(() => setIsOpen(false));

      return (
        <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
          <div>モーダルコンテンツ</div>
        </Modal>
      );
    };

    render(<TestModalComponent />);

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);
    expect(screen.getByText("モーダルコンテンツ")).toBeInTheDocument();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("モーダルサイズクラスが正しく適用される", () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} size="large">
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    const modalElement = container.querySelector('[role="dialog"]');
    expect(modalElement).toHaveClass("large");
  });

  it("タイトルがない場合はNoTitleの閉じるボタンが表示される", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText("閉じる");
    expect(closeButton).toBeInTheDocument();
  });
});
