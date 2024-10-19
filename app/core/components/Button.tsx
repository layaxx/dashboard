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

type ButtonVariant = "danger" | "success" | "light" | "primary" | "secondary"
export type ButtonRoundedValue = "all" | "none" | "left" | "right"
export type ButtonSize = "sm" | "md" | "lg" | "xl"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
  variant?: ButtonVariant
  onClick?: MouseEventHandler<HTMLButtonElement>
  icon?: ReactChild
  submit?: boolean
  href?: Url
  rounded?: ButtonRoundedValue
  size?: ButtonSize
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
  size = "md",
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

  if (!["md"].includes(size)) {
    console.error("This button size is not yet implemented", size)
  }

  return (
    <Wrapper>
      <button
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
            "focus:ring-2",
            (rounded === "all" || rounded === "left") && "rounded-l-md",
            (rounded === "all" || rounded === "right") && "rounded-r-md",
            "shadow-sm",
            disabled && "text-opacity-70",
            size === "sm" && ["text-sm", "p-1"],
            size === "md" && ["text-base", "px-4", "py-2"],
            size === "lg" && ["text-base", "md:text-lg", "px-6", "py-3"],
            size === "xl" && ["text-lg", "px-8", "py-4"],
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
            variant === "success" && [
              "bg-green-600",
              !disabled && "hover:bg-green-700",
              "focus:ring-green-500",
              "text-white",
              "border-transparent",
            ],
            variant === "primary" && [
              "bg-primary",
              !disabled && "hover:bg-violet-700",
              "focus:ring-violet-500",
              "text-white",
              "border-transparent",
            ],
            variant === "secondary" && [
              "bg-indigo-100",
              !disabled && "hover:bg-indigo-200",
              "focus:ring-indigo-300",
              "text-indigo-700",
              "border-transparent",
            ],
            "w-auto",
            isInsideButtonGroup && ["mx-0", "grow"],
          ),
          rest.className,
        )}
        onClick={onClick}
      >
        {icon && (
          <span
            className={clsx(
              size === "sm" && ["mr-1", "w-5"],
              size === "md" && ["mr-2", "w-6"],
              size === "lg" && ["mr-4", "w-6"],
              size === "xl" && ["mr-6", "w-7"],
              "my-auto",
            )}
          >
            {icon}
          </span>
        )}
        {children}
      </button>
    </Wrapper>
  )
}

export default Button
