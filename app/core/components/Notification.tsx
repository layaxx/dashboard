import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import Image from "next/legacy/image"
import { toast } from "react-toastify"

export declare const STATUSES: {
  none: "none"
  info: "info"
  success: "success"
  loading: "loading"
  warning: "warning"
  error: "error"
}
export type Status = typeof STATUSES[keyof typeof STATUSES]

export declare const POSITIONS: {
  topCenter: "top-center"
  topLeft: "top-left"
  topRight: "top-right"
  bottomCenter: "bottom-center"
  bottomLeft: "bottom-left"
  bottomRight: "bottom-right"
}
export type Position = typeof POSITIONS[keyof typeof POSITIONS]

export interface NotificationType {
  id: string
  title?: string
  message?: string
  status: Status
  position: Position
  buttons: ButtonProps[]
  image?: string
  dismissAfter?: number
  dismissible?: boolean
  onAdd?: (...arguments_: any[]) => void
  onDismiss?: (...arguments_: any[]) => void
  showDismissButton?: boolean
  allowHTML?: boolean
  [index: string]: any
}

type Props = {
  notification: NotificationType
  closeToast?: () => void
}

type ButtonProps = {
  name: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const Button = ({ name: text, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "border",
      "border-transparent",
      "flex",
      "font-medium",
      "items-center",
      "justify-center",
      "focus:outline-none",
      "p-4",
      "focus:ring-2",
      "focus:ring-indigo-500",
      "rounded-none",
      "rounded-r-lg",
      "hover:text-indigo-500",
      "text-indigo-600",
      "text-sm",
      "w-full"
    )}
  >
    {text}
  </button>
)

const getIcon = (status: Status) => {
  switch (status) {
    case "error":
      return <ExclamationCircleIcon className="text-error" />
    case "info":
      return <InformationCircleIcon />
    case "success":
      return <CheckCircleIcon className="text-success" />
    case "warning":
      return <ExclamationCircleIcon className="text-warning" />
    case "loading":
      return <ArrowPathIcon className="animate-spin" />

    case "none":
    default:
      return <></>
  }
}

const Notification = ({ notification, closeToast }: Props) => {
  closeToast = closeToast ?? (() => toast.dismiss(notification.id))

  return (
    <div
      className={clsx(
        "bg-white",
        "flex",
        "max-w-md",
        "pointer-events-auto",
        "ring-1",
        "ring-black/5",
        notification.dismissible === false ? "rounded-lg" : "rounded-t-lg",
        "shadow-lg",
        "w-96"
      )}
    >
      <div className={clsx("flex-1", "p-4", "w-0")}>
        <div className={clsx("flex", "items-start")}>
          {notification.image ? (
            <div className={clsx("pt-0.5", "shrink-0")}>
              <Image
                className={clsx("h-10", "rounded-full", "w-10")}
                src={notification.image}
                alt=""
              />
            </div>
          ) : (
            <div className={clsx("h-auto", "pt-0.5", "shrink-0", "w-6")}>
              {getIcon(notification.status)}
            </div>
          )}

          <div className={clsx("flex-1", "ml-3", "self-center")}>
            <p className={clsx("font-medium", "text-gray-900", "text-sm")}>{notification.title}</p>
            {notification.message && (
              <p className={clsx("mt-1", "text-gray-500", "text-sm")}>{notification.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className={clsx("border-gray-200", "border-l", "flex")}>
        {notification.showDismissButton && <Button name="X" onClick={closeToast} />}
        {notification.buttons.map((button) => (
          <button
            onClick={(event) => {
              button.onClick(event)
              closeToast?.call(this)
            }}
            className={clsx(
              "border",
              "border-transparent",
              "flex",
              "font-medium",
              "items-center",
              "justify-center",
              "focus:outline-none",
              "p-4",
              "focus:ring-2",
              "focus:ring-indigo-500",
              "rounded-none",
              "rounded-r-lg",
              "hover:text-indigo-500",
              "text-indigo-600",
              "text-sm",
              "w-full"
            )}
            key={button.name}
          >
            {button.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Notification
