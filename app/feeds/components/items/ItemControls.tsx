import { StarIcon, EyeIcon, EyeOffIcon, ExternalLinkIcon } from "@heroicons/react/solid"
import { ItemAPIResponse } from "../ItemsList"

type ItemControlProps = {
  item: ItemAPIResponse
  read: Function
  unread: Function
  hasBeenRead: boolean
}

const ItemControls = ({ item, read, unread, hasBeenRead }: ItemControlProps) => {
  const sharedClassName = "hover:text-primary px-1 w-8"

  return (
    <>
      <StarIcon className={sharedClassName} />
      <span
        className={sharedClassName}
        onClick={() => {
          if (hasBeenRead) {
            unread()
          } else {
            read()
          }
        }}
      >
        {hasBeenRead && <EyeIcon />}
        {!hasBeenRead && <EyeOffIcon />}
      </span>
      <a
        href={item.url}
        title={item.title}
        referrerPolicy="no-referrer"
        rel="noopener noreferrer"
        target="_blank"
        className={sharedClassName}
        onClick={() => read()}
      >
        <ExternalLinkIcon />
      </a>
    </>
  )
}

export default ItemControls
