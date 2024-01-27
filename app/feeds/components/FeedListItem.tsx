import clsx from "clsx"

type Props = {
  title: string
  unreadCount?: number
  onClick: React.MouseEventHandler<HTMLLIElement>
  isActive: boolean
}

const FeedListItem = ({ title, unreadCount, onClick, isActive }: Props) => {
  return (
    <li
      className={clsx(
        "hover:bg-slate-200",
        "border-l-4",
        isActive ? "border-primary" : "border-transparent",
        "cursor-pointer",
        "flex",
        "pl-2",
        "py-1"
      )}
      onClick={onClick}
    >
      <span className="grow">{title}</span>{" "}
      {unreadCount !== undefined && (
        <span className={clsx("bg-primary", "font-bold", "px-3", "rounded-xl", "text-white")}>
          {unreadCount}
        </span>
      )}
    </li>
  )
}

export default FeedListItem
