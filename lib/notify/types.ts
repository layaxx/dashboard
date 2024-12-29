import { ReactEventHandler } from "react"
import { ToastOptions } from "react-toastify"
import { Status } from "app/core/components/Notification"

export type NotifyButton = {
  name: string
  onClick: ReactEventHandler
}
export type NotifyOptions = {
  message?: string
  status?: Status
  showDismissButton?: boolean
  dismissAfter?: number | false
  dismissible?: false
  image?: string
  buttons?: NotifyButton[]
  id?: string
  toastOptions?: ToastOptions
}

export type NotifyPromiseSharedOptions = {
  title?: string
  message?: string
  id?: string
  showDismissButton?: boolean
  image?: string
  buttons?: NotifyButton[]
  dismissible?: false
  dismissAfter?: number
}

export type NotifyPromiseOptions = {
  title?: string
  message?: string
}
