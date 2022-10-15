import { ReactEventHandler } from "react"
import dayjs from "dayjs"
import { toast } from "react-toastify"
import Notification, { NotificationType, Status } from "../components/Notification"

type NotifyButton = {
  name: string
  onClick: ReactEventHandler
}
type NotifyOptions = {
  message?: string
  status?: Status
  showDismissButton?: boolean
  dismissAfter?: number | false
  dismissible?: false
  image?: string
  buttons?: NotifyButton[]
  id?: string
}

export default function notify(title: string, options?: NotifyOptions) {
  const id = options?.id ?? dayjs().toISOString()

  const notification: NotificationType = {
    title: title ?? "Information",
    message: options?.message ?? "",
    status: options?.status ?? "info",
    showDismissButton: options?.showDismissButton ?? true,
    image: options?.image ?? undefined,
    id,
    buttons: options?.buttons ?? [],
    position: "top-right",
    dismissible: options?.dismissible,
  }

  return toast(
    ({ closeToast }) => <Notification notification={notification} closeToast={closeToast} />,
    {
      closeOnClick: false,
      theme: "light",
      autoClose: options?.dismissible === false ? false : options?.dismissAfter,
      className: "test",
      closeButton: false,
      toastId: id,
    }
  )
}
