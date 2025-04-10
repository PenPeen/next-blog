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

interface ButtonProps {
  children: React.ReactNode
  type?: ButtonType;
  size?: ButtonSize;
  isRadius?: boolean;
  isSolid?: boolean;
  isFull?: boolean;
  isDisabled?: boolean;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({
  type = BUTTON_TYPES.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  isRadius = false,
  isSolid = false,
  isFull = false,
  isDisabled = false,
  handleClick,
  children,
}: ButtonProps) => {
  const getClassNames = () => {
    const classNames = [
      styles.a_button,
      styles[`a_button__${size}`],
      styles[`a_button__${type}`],
      isSolid && styles[`a_button__${type}_solid`],
      isRadius && styles.a_button__radius,
      isFull && styles.a_button__full
    ].filter(Boolean);

    return classNames.join(" ");
  };

  return (
    <button
      type='button'
      disabled={isDisabled}
      className={getClassNames()}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
