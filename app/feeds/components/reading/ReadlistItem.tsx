import { useMutation } from "blitz"
import { ExternalLinkIcon, XIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { useNotifications } from "reapop"
import updateReadlistentry from "app/feeds/readlistentries/mutations/updateReadlistentry"

type Props = {
  url: string
  id: number
  hide: Function
  unhide: Function
}

const ReadlistItem = ({ url, id, hide, unhide }: Props) => {
  const sharedClassName = "hover:text-primary px-1 w-8"

  const [updateEntry] = useMutation(updateReadlistentry)

  const { notify } = useNotifications()

  return (
    <div key={id} className="last:mb-80">
      <div
        className={clsx(
          "hover:bg-neutral-200",
          "cursor-pointer",
          "flex",
          "font-medium",
          "px-2",
          "rounded-sm",
          "text-lg"
        )}
      >
        <span className={clsx("grow", "py-4", "truncate")} title={url}>
          {url}
        </span>
        <span className={clsx("border-l-2", "flex", "py-4", "shrink-0", "text-gray-400")}>
          <span className={sharedClassName}>
            <XIcon
              onClick={() => {
                hide()
                updateEntry({ id, isArchived: true })
                notify({
                  buttons: [
                    {
                      name: "undo",
                      onClick: () => {
                        unhide()
                        updateEntry({ id, isArchived: false })
                      },
                    },
                  ],

                  title: "You deleted an item",
                  dismissAfter: 5000,
                  dismissible: true,
                })
              }}
            />
          </span>
          <a
            href={url}
            title={url}
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            target="_blank"
            className={sharedClassName}
          >
            <ExternalLinkIcon />
          </a>
        </span>
      </div>
    </div>
  )
}

export default ReadlistItem
