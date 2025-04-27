import styles from "./Button.module.css";

const BUTTON_TYPES = {
  PRIMARY: "primary",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
  NEUTRAL: "neutral"
} as const;

const BUTTON_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large"
} as const;

type ButtonType = typeof BUTTON_TYPES[keyof typeof BUTTON_TYPES];
type ButtonSize = typeof BUTTON_SIZES[keyof typeof BUTTON_SIZES];
type HTMLButtonType = "button" | "submit" | "reset";

interface ButtonProps {
  children: React.ReactNode
  type?: ButtonType;
  size?: ButtonSize;
  isRadius?: boolean;
  isSolid?: boolean;
  isFull?: boolean;
  isDisabled?: boolean;
  buttonType?: HTMLButtonType;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  type = BUTTON_TYPES.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  buttonType = "button",
  isRadius = false,
  isSolid = false,
  isFull = false,
  isDisabled = false,
  handleClick,
  children,
}: ButtonProps) {
  const getClassNames = () => {
    const classNames = [
      styles.button,
      styles[`button__${size}`],
      styles[`button__${type}`],
      isSolid && styles[`button__${type}_solid`],
      isRadius && styles.button__radius,
      isFull && styles.button__full
    ].filter(Boolean);

    return classNames.join(" ");
  };

  return (
    <button
      type={buttonType}
      disabled={isDisabled}
      className={getClassNames()}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
