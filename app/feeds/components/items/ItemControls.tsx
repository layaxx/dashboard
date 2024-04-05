import { EyeIcon, EyeSlashIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import { Feedentry } from "@prisma/client"
import clsx from "clsx"

type ItemControlProps = {
  item: Feedentry
  read: Function
  unread: Function
  hasBeenRead: boolean
}

const ItemControls = ({ item, read, unread, hasBeenRead }: ItemControlProps) => {
  const sharedClassName = "hover:text-primary px-1 w-8"

  return (
    <>
      <span
        className={clsx(sharedClassName, "ml-2")}
        onClick={() => {
          if (hasBeenRead) {
            unread()
          } else {
            read()
          }
        }}
      >
        {hasBeenRead && <EyeIcon />}
        {!hasBeenRead && <EyeSlashIcon />}
      </span>
      <a
        href={item.link}
        title={item.title}
        referrerPolicy="no-referrer"
        rel="noopener noreferrer"
        target="_blank"
        className={sharedClassName}
        onClick={() => read()}
      >
        <ArrowTopRightOnSquareIcon />
      </a>
    </>
  )
}

export default ItemControls
