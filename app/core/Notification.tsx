import { Image } from "blitz"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline"
import clsx from "clsx"
import { Notification as NotificationType, Status } from "reapop"
import { DismissNotification } from "reapop/dist/components/NotificationsSystem"

type Props = {
  notification: NotificationType
  dismissNotification: DismissNotification
}

type ButtonProps = {
  text: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
const Button = ({ text, onClick }: ButtonProps) => (
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
    case "none":
    default:
      return <></>
  }
}

const Notification = ({ notification, dismissNotification }: Props) => {
  return (
    <div
      className={clsx(
        "bg-white",
        "flex",
        "max-w-md",
        "pointer-events-auto",
        "ring-1",
        "ring-black/5",
        "rounded-lg",
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
        {notification.showDismissButton && (
          <Button text="" onClick={() => dismissNotification(notification.id)} />
        )}
        {notification.buttons.map((button) => (
          <button
            onClick={() => {
              button.onClick?.call(this)
              dismissNotification(notification.id)
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
