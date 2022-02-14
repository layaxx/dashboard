import React, { ReactChild } from "react"
import clsx from "clsx"

type Button = {
  props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  handler: React.MouseEventHandler<HTMLButtonElement>
  text?: string
}

type Props = {
  cancelButton: Button
  confirmButton: Button
  icon?: ReactChild
  title: ReactChild
  content: ReactChild
}

const GenericModal = ({ cancelButton, confirmButton, icon, title, content }: Props) => {
  return (
    <div
      className={clsx("fixed", "inset-0", "overflow-y-auto", "z-10")}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={clsx(
          "sm:block",
          "flex",
          "items-end",
          "justify-center",
          "min-h-screen",
          "sm:p-0",
          "pb-20",
          "pt-4",
          "px-4",
          "text-center"
        )}
      >
        <div
          className={clsx("-z-10", "bg-gray-500/75", "fixed", "inset-0", "transition-opacity")}
          aria-hidden="true"
        />

        <span
          className={clsx("sm:align-middle", "sm:h-screen", "hidden", "sm:inline-block")}
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className={clsx(
            "align-bottom",
            "sm:align-middle",
            "bg-white",
            "inline-block",
            "sm:max-w-lg",
            "sm:my-8",
            "overflow-hidden",
            "rounded-lg",
            "shadow-xl",
            "text-left",
            "transition-all",
            "sm:w-full"
          )}
        >
          <div className={clsx("bg-white", "sm:p-6", "pb-4", "sm:pb-4", "pt-5", "px-4")}>
            <div className={clsx("sm:flex", "sm:items-start")}>
              {icon && (
                <div
                  className={clsx(
                    "bg-red-100",
                    "flex",
                    "sm:h-10",
                    "h-12",
                    "items-center",
                    "justify-center",
                    "sm:mx-0",
                    "mx-auto",
                    "rounded-full",
                    "shrink-0",
                    "sm:w-10",
                    "w-12"
                  )}
                >
                  {icon}
                </div>
              )}
              <div className={clsx("sm:ml-4", "sm:mt-0", "mt-3", "text-center", "sm:text-left")}>
                <h3
                  className={clsx("font-medium", "leading-6", "text-gray-900", "text-lg")}
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">{content}</div>
              </div>
            </div>
          </div>
          <div
            className={clsx(
              "bg-gray-50",
              "sm:flex",
              "sm:flex-row-reverse",
              "px-4",
              "sm:px-6",
              "py-3"
            )}
          >
            <button
              type="button"
              className={clsx(
                "bg-red-600",
                "hover:bg-red-700",
                "border",
                "border-transparent",
                "font-medium",
                "inline-flex",
                "justify-center",
                "sm:ml-3",
                "focus:outline-none",
                "px-4",
                "py-2",
                "focus:ring-2",
                "focus:ring-offset-2",
                "focus:ring-red-500",
                "rounded-md",
                "shadow-sm",
                "text-base",
                "sm:text-sm",
                "text-white",
                "sm:w-auto",
                "w-full"
              )}
              {...confirmButton.props}
              onClick={confirmButton.handler}
            >
              {confirmButton.text ?? "Deactivate"}
            </button>
            <button
              type="button"
              className={clsx(
                "hover:bg-gray-50",
                "bg-white",
                "border",
                "border-gray-300",
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
                "focus:ring-indigo-500",
                "focus:ring-offset-2",
                "rounded-md",
                "shadow-sm",
                "text-base",
                "text-gray-700",
                "sm:text-sm",
                "sm:w-auto",
                "w-full"
              )}
              {...cancelButton.props}
              onClick={cancelButton.handler}
            >
              {cancelButton.text ?? "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenericModal
