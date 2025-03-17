import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import Image from "next/legacy/image"
import { toast } from "react-toastify"
import NotificationButton, { NotificationButtonProps } from "./NotificationButton"

export type Status = "none" | "info" | "success" | "loading" | "warning" | "error"
export type Position =
  | "top-center"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"

export interface NotificationType {
  id: string
  title?: string
  message?: string
  status: Status
  position: Position
  buttons: NotificationButtonProps[]
  image?: string
  dismissAfter?: number
  dismissible?: boolean
  onAdd?: (...arguments_: unknown[]) => void
  onDismiss?: (...arguments_: unknown[]) => void
  showDismissButton?: boolean
  allowHTML?: boolean
}

type Props = {
  notification: NotificationType
  closeToast?: () => void
}

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

    default:
      return <></>
  }
}

const Notification = ({ notification, closeToast }: Props) => {
  closeToast = closeToast ?? (() => toast.dismiss(notification.id))

  return (
    <div
      className={clsx(
        "dark:bg-slate-700",
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
            <p className={clsx("font-medium", "dark:text-gray-300", "text-gray-900", "text-sm")}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={clsx("mt-1", "dark:text-gray-400", "text-gray-500", "text-sm")}>
                {notification.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={clsx("border-gray-200", "border-l-2", "dark:border-slate-500", "flex")}>
        {notification.showDismissButton && <NotificationButton name="X" onClick={closeToast} />}
        {notification.buttons.map((button) => (
          <NotificationButton
            key={button.name}
            {...button}
            onClick={(event) => {
              button.onClick(event)
              closeToast?.call(this)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Notification
