import { StarIcon, EyeIcon, EyeOffIcon, ExternalLinkIcon } from "@heroicons/react/solid"
import { ItemAPIResponse } from "../ItemsList"

type ItemControlProps = {
  item: ItemAPIResponse
  toggle: Function
  hasBeenRead: boolean
}

const ItemControls = ({ item, toggle, hasBeenRead }: ItemControlProps) => {
  const sharedClassName = "hover:text-primary px-1 w-8"

  return (
    <>
      <StarIcon className={sharedClassName} />
      <span className={sharedClassName}>
        {hasBeenRead && <EyeIcon onClick={() => toggle()} />}
        {!hasBeenRead && <EyeOffIcon onClick={() => toggle()} />}
      </span>
      <a
        href={item.url}
        title={item.title}
        referrerPolicy="no-referrer"
        rel="noopener noreferrer"
        target="_blank"
        className={sharedClassName}
        onClick={() => toggle()}
      >
        <ExternalLinkIcon />
      </a>
    </>
  )
}

export default ItemControls
