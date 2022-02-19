import clsx from "clsx"

type Props = {
  title: string
  unreadCount: number
  onClick: React.MouseEventHandler<HTMLLIElement>
  isActive: boolean
}

const FeedListItem = ({ title, unreadCount, onClick, isActive }: Props) => {
  return (
    <li
      className={clsx(
        "hover:bg-slate-200",
        "cursor-pointer",
        "flex",
        "py-1",
        isActive && ["pl-2", "border-l-4", "border-primary"]
      )}
      onClick={onClick}
    >
      <span className="grow">{title}</span>{" "}
      <span className={clsx("bg-primary", "font-bold", "px-3", "rounded-xl", "text-white")}>
        {unreadCount}
      </span>
    </li>
  )
}

export default FeedListItem
