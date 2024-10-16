import React, { ReactChild, ReactNode } from "react"
import clsx from "clsx"
import Button from "./Button"

interface IButton {
  props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  handler: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>
  text?: string
}

interface IProps {
  cancelButton: IButton
  confirmButton?: IButton
  icon?: ReactChild
  title: ReactChild
  drawFocusToCancelButton?: boolean
  children: ReactNode
}

const GenericModal: React.FC<IProps> = ({ cancelButton, confirmButton, icon, title, children }) => {
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
          "text-center",
        )}
        id="modal-backdrop"
        onClick={(event) => {
          // @ts-ignore
          if (event.target.id === "modal-backdrop") {
            cancelButton.handler(event)
          }
        }}
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
            "sm:w-full",
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
                    "w-12",
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
                <div className="mt-2">{children}</div>
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
              "py-3",
            )}
          >
            {confirmButton && (
              <Button {...confirmButton.props} onClick={confirmButton.handler} variant="danger">
                {confirmButton.text ?? "Deactivate"}
              </Button>
            )}

            <Button onClick={cancelButton.handler} {...cancelButton.props}>
              {cancelButton.text ?? "Cancel"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenericModal
