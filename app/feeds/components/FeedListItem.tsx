import { DetailedHTMLProps, FC, LiHTMLAttributes } from "react"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

type LIProps = DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>

export const FeedListItemWrapper: FC<LIProps> = ({ children, className, ...props }) => {
  return (
    <li
      className={twMerge(
        clsx(
          "hover:bg-slate-200",
          "dark:hover:bg-slate-800",
          "border-l-4",
          "border-transparent",
          "cursor-pointer",
          "flex",
          "pl-2",
          "py-1",
        ),
        className,
      )}
      {...props}
    >
      {children}
    </li>
  )
}

export const FeedListItemBadge: FC<LIProps> = ({ children, className, ...props }) => (
  <span
    className={twMerge(
      clsx("bg-primary", "dark:bg-violet-500", "font-bold", "px-3", "rounded-xl", "text-white"),
      className,
    )}
    {...props}
  >
    {children}
  </span>
)

type Props = {
  title: string
  unreadCount?: number
  onClick: React.MouseEventHandler<HTMLLIElement>
  isActive: boolean
  id?: string
}

const FeedListItem = ({ title, unreadCount, onClick, isActive, id }: Props) => {
  const otherProps = id ? { id } : {}
  return (
    <FeedListItemWrapper
      className={clsx(isActive && ["border-primary", "dark:border-purple-500"])}
      {...otherProps}
      onClick={onClick}
    >
      <span className="grow">{title}</span>{" "}
      {unreadCount !== undefined && <FeedListItemBadge>{unreadCount}</FeedListItemBadge>}
    </FeedListItemWrapper>
  )
}

export default FeedListItem
