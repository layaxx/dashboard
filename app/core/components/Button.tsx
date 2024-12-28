import {
  ButtonHTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
  ReactChild,
  ReactNode,
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
  children: ReactNode
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
    ? ({ children }: PropsWithChildren<unknown>) => (
        <Link href={href} passHref className="contents">
          {children}
        </Link>
      )
    : ({ children }: PropsWithChildren<unknown>) => <>{children}</>

  const context = useContext(ButtonGroupContext)
  const isInsideButtonGroup = !!context
  if (isInsideButtonGroup) {
    rounded = context
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
              !disabled && ["hover:bg-gray-100", "dark:hover:bg-slate-700"],
              "bg-white",
              "dark:bg-slate-600",
              "border-gray-300",
              "dark:border-slate-700",
              "focus:ring-indigo-500",
              "dark:focus:ring-sky-700",
              "text-gray-700",
              "dark:text-gray-300",
            ],
            variant === "danger" && [
              "bg-red-600",
              "dark:bg-red-700",
              !disabled && ["hover:bg-red-700", "dark:hover:bg-red-800"],
              "focus:ring-red-500",
              "text-white",
              "dark:text-slate-100",
              "border-transparent",
            ],
            variant === "success" && [
              "bg-green-600",
              "dark:bg-green-700",
              !disabled && ["hover:bg-green-700", "dark:hover:bg-green-800"],
              "focus:ring-green-500",
              "dark:focus:ring-green-600",
              "text-white",
              "dark:text-slate-100",
              "border-transparent",
            ],
            variant === "primary" && [
              "bg-primary",
              "dark:bg-violet-800",
              !disabled && ["hover:bg-violet-700", "dark:hover:bg-violet-900"],
              "focus:ring-violet-500",
              "dark:focus:ring-violet-600",
              "text-white",
              "dark:text-slate-100",
              "border-transparent",
            ],
            variant === "secondary" && [
              "bg-indigo-100",
              "dark:bg-sky-800",
              !disabled && ["hover:bg-indigo-200", "dark:hover:bg-sky-900"],
              "focus:ring-indigo-300",
              "dark:focus:ring-sky-700",
              "text-indigo-700",
              "dark:text-sky-100",
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
