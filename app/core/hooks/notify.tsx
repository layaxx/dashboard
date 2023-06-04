import { ReactEventHandler } from "react"
import dayjs from "dayjs"
import { ToastOptions, toast } from "react-toastify"
import Notification, { NotificationType, Position, Status } from "../components/Notification"

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
  toastOptions?: ToastOptions
}

function getNotificationProps(
  options: { title: string; id: string } & NotifyOptions
): NotificationType {
  return {
    title: options.title ?? "Information",
    message: options?.message ?? "",
    status: options?.status ?? "info",
    showDismissButton: options?.showDismissButton ?? true,
    image: options?.image ?? undefined,
    id: options.id,
    buttons: options?.buttons ?? [],
    position: "top-right",
    dismissible: options?.dismissible,
  }
}

export default function notify(title: string, options?: NotifyOptions) {
  const id = options?.id ?? dayjs().toISOString()

  const notification: NotificationType = getNotificationProps({ title, id, ...options })

  return toast(
    ({ closeToast }) => <Notification notification={notification} closeToast={closeToast} />,
    {
      closeOnClick: false,
      theme: "light",
      autoClose: options?.dismissible === false ? false : options?.dismissAfter,
      className: "test",
      closeButton: false,
      toastId: id,
      ...options?.toastOptions,
    }
  )
}

type NotifyPromiseSharedOptions = {
  title?: string
  message?: string
  id?: string
  showDismissButton?: boolean
  image?: string
  buttons?: NotifyButton[]
  dismissible?: false
  dismissAfter?: number
}

type NotifyPromiseOptions = {
  title?: string
  message?: string
}

export function notifyPromise(
  promise: Promise<unknown> | (() => Promise<unknown>),
  options: {
    all?: NotifyPromiseSharedOptions
    pending?: NotifyPromiseOptions
    success?: NotifyPromiseOptions
    error?: NotifyPromiseOptions
  }
) {
  const id = options?.all?.id ?? dayjs().toISOString()
  const sharedProps = {
    showDismissButton: options.all?.showDismissButton ?? true,
    image: options.all?.image ?? undefined,
    id,
    buttons: options.all?.buttons ?? [],
    position: "top-right" as Position,
  }

  return toast.promise(
    promise,
    {
      pending: {
        render({ closeToast }) {
          return (
            <Notification
              notification={{
                ...sharedProps,
                title: options.all?.title ?? options.pending?.title ?? "Information",
                message: options.all?.message ?? options.pending?.message,
                status: "loading",
                dismissible: false,
              }}
              closeToast={closeToast}
            />
          )
        },
      },
      success: {
        render({ closeToast }) {
          return (
            <Notification
              notification={{
                ...sharedProps,
                title: options.all?.title ?? options.success?.title ?? "Information",
                message: options.all?.message ?? options.success?.message,
                status: "success",
              }}
              closeToast={closeToast}
            />
          )
        },
      },
      error: {
        render({ closeToast }) {
          return (
            <Notification
              notification={{
                ...sharedProps,
                title: options.all?.title ?? options.error?.title ?? "Information",
                message: options.all?.message ?? options.error?.message,
                status: "error",
              }}
              closeToast={closeToast}
            />
          )
        },
      },
    },
    {
      closeOnClick: false,
      theme: "light",
      autoClose: options.all?.dismissible === false ? false : options?.all?.dismissAfter,
      className: "test",
      closeButton: false,
      toastId: id,
      icon: false,
    }
  )
}

export function notifyPromiseAdvanced<T>(
  promise: Promise<T> | (() => Promise<T>),
  options: {
    all?: NotifyPromiseSharedOptions
    pending?: NotifyPromiseOptions
    success?: (argument0: T) => Promise<NotifyPromiseOptions>
    error?: (argument0: T) => Promise<NotifyPromiseOptions>
  }
) {
  const id = notify(options.all?.title ?? options.pending?.title ?? "Information", {
    status: "loading",
    dismissible: false,
    ...options.pending,
  })

  return (typeof promise === "function" ? promise() : promise)
    .then(async (resolved) => {
      const successOptions =
        typeof options.success === "function" ? await options.success(resolved) : options.all

      const notificationProps = getNotificationProps({
        status: "success",
        title: "Success!",
        id: String(id),
        dismissible: undefined,
        ...successOptions,
      })

      toast.update(id, {
        render({ closeToast }) {
          return <Notification notification={notificationProps} closeToast={closeToast} />
        },
        autoClose: 3000,
      })
    })
    .catch(async (error) => {
      const errorOptions =
        typeof options.error === "function" ? await options.error(error) : options.all

      const notificationProps = getNotificationProps({
        status: "error",
        title: "Error.",
        id: String(id),
        dismissible: undefined,
        ...errorOptions,
      })

      toast.update(id, {
        render({ closeToast }) {
          return <Notification notification={notificationProps} closeToast={closeToast} />
        },
        autoClose: 5000,
      })
    })
}
