import {
  ButtonHTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
  ReactChild,
  useContext,
} from "react"
import clsx from "clsx"
import { Url } from "next/dist/shared/lib/router/router"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { ButtonGroupContext } from "./ButtonGroup"

type ButtonVariant = "danger" | "success" | "light" | "primary"
export type ButtonRoundedValue = "all" | "none" | "left" | "right"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
  variant?: ButtonVariant
  onClick?: MouseEventHandler<HTMLButtonElement>
  icon?: ReactChild
  submit?: boolean
  href?: Url
  rounded?: ButtonRoundedValue
}

const Button = ({
  children,
  type = "button",
  variant = "light",
  onClick,
  icon,
  disabled,
  href,
  rounded = "all",
  ...rest
}: ButtonProps) => {
  const Wrapper = href
    ? ({ children }: PropsWithChildren<{}>) => (
        <Link href={href} passHref className="contents">
          {children}
        </Link>
      )
    : ({ children }: PropsWithChildren<{}>) => <>{children}</>

  const context = useContext(ButtonGroupContext)
  const isInsideButtonGroup = !!context
  if (isInsideButtonGroup) {
    rounded = context
  }

  return (
    <Wrapper>
      <button
        data-rounded={rounded}
        data-ctx={context}
        {...rest}
        disabled={disabled}
        type={type}
        className={twMerge(
          clsx(
            "align-middle",
            "border",
            "font-medium",
            "inline-flex",
            "justify-center",
            "focus:outline-none",
            "px-4",
            "py-2",
            "focus:ring-2",
            "focus:ring-offset-2",
            (rounded === "all" || rounded === "left") && "rounded-l-md",
            (rounded === "all" || rounded === "right") && "rounded-r-md",
            "shadow-sm",
            disabled && "text-opacity-70",
            "text-sm",
            variant === "light" && [
              !disabled && "hover:bg-gray-100",
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
            "w-auto",
            isInsideButtonGroup && ["mx-0", "grow"],
          ),
          rest.className,
        )}
        onClick={onClick}
      >
        {icon && <span className={clsx("mr-2", "w-5")}>{icon}</span>}
        {children}
      </button>
    </Wrapper>
  )
}

export default Button
