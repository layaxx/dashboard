import { RouteUrlObject } from "blitz"
import { ButtonHTMLAttributes, MouseEventHandler, PropsWithChildren, ReactChild } from "react"
import clsx from "clsx"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

type ButtonVariant = "danger" | "success" | "light" | "primary"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: any
  variant?: ButtonVariant
  onClick?: MouseEventHandler<HTMLButtonElement>
  icon?: ReactChild
  submit?: boolean
  notRounded?: boolean
  href?: string | RouteUrlObject
}

const Button = ({
  children,
  type = "button",
  variant = "light",
  onClick,
  icon,
  disabled,
  notRounded,
  href,
  ...rest
}: ButtonProps) => {
  const Wrapper = href
    ? ({ children }: PropsWithChildren<{}>) => (
        <Link href={href} passHref className="contents">
          {children}
        </Link>
      )
    : ({ children }: PropsWithChildren<{}>) => <>{children}</>

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
            "px-4",
            "py-2",
            "focus:ring-2",
            "focus:ring-offset-2",
            !notRounded && "rounded-md",
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
            "w-auto"
          ),
          rest.className
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
