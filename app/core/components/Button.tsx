import { ButtonHTMLAttributes, MouseEventHandler, ReactChild } from "react"
import clsx from "clsx"

type ButtonVariant = "danger" | "success" | "light" | "primary"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
  variant?: ButtonVariant
  onClick?: MouseEventHandler<HTMLButtonElement>
  icon?: ReactChild
  submit?: boolean
}

const Button = ({
  children,
  type = "button",
  variant = "light",
  onClick,
  icon,
  disabled,
  ...rest
}: Props) => {
  return (
    <button
      {...rest}
      disabled={disabled}
      type={type}
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={clsx(
        "align-middle",
        "border",
        "font-medium",
        "inline-flex",
        "justify-center",
        "sm:ml-3",
        "sm:mt-0",
        "mt-3",
        "focus:outline-none",
        "px-4",
        "py-2",
        "focus:ring-2",
        "focus:ring-offset-2",
        "rounded-md",
        "shadow-sm",
        "text-base",
        disabled && "text-opacity-70",
        "sm:text-sm",
        "sm:w-auto",
        variant === "light" && [
          !disabled && "hover:bg-gray-50",
          "bg-white",
          "border-gray-300",
          "focus:ring-indigo-500",
          "text-gray-700",
        ],
        variant === "danger" && [
          "bg-red-600",
          !disabled && "hover:bg-red-700",
          "focus:ring-red-500",
          "text-white",
          "border-transparent",
        ],
        "w-full"
      )}
      onClick={onClick}
    >
      {icon && <span className={clsx("mr-2", "w-5")}>{icon}</span>}
      {children}
    </button>
  )
}

export default Button
