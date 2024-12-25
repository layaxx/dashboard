import clsx from "clsx"

export type NotificationButtonProps = {
  name: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isLast?: boolean
}

const NotificationButton = ({ name: text, onClick }: NotificationButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "hover:bg-slate-200",
      "dark:hover:bg-slate-600",
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
      "ring-inset",
      "dark:focus:ring-violet-500",
      "rounded-none",
      "last-of-type:rounded-r-lg",
      "hover:text-indigo-500",
      "text-nowrap",
      "text-primary",
      "dark:text-slate-300",
      "text-sm",
      "w-full",
    )}
  >
    {text}
  </button>
)

export default NotificationButton
