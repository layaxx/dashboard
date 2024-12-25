import { useMutation } from "@blitzjs/rpc"
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { notifyPromise } from "app/core/hooks/notify"
import updateReadlistentry from "app/feeds/readlistentries/mutations/updateReadlistentry"

type Props = {
  url: string
  id: number
  hide: Function
  unhide: Function
}

const ReadlistItem = ({ url, id, hide, unhide }: Props) => {
  const sharedClassName = "hover:text-primary hover:text-violet-500 px-1 w-8"

  const [updateEntry] = useMutation(updateReadlistentry)

  return (
    <div key={id} className="last:mb-80">
      <div
        className={clsx(
          "hover:bg-neutral-200",
          "dark:hover:bg-slate-700",
          "cursor-pointer",
          "flex",
          "font-medium",
          "lg:px-10",
          "px-2",
          "rounded-sm",
          "text-lg",
        )}
      >
        <span className={clsx("grow", "py-4", "truncate")} title={url}>
          {url}
        </span>
        <span
          className={clsx(
            "border-l-2",
            "dark:border-slate-600",
            "flex",
            "py-4",
            "shrink-0",
            "text-gray-400",
          )}
        >
          <span className={sharedClassName}>
            <XMarkIcon
              onClick={() => {
                hide()
                notifyPromise(updateEntry({ id, isArchived: false }), {
                  pending: { title: "Deleting entry" },
                  success: { title: "Deleted Entry" },
                  error: { title: "Failed to delete Entry" },
                  all: {
                    buttons: [
                      {
                        name: "undo",
                        onClick: () => {
                          unhide()
                          updateEntry({ id, isArchived: false })
                        },
                      },
                    ],
                  },
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
            <ArrowTopRightOnSquareIcon />
          </a>
        </span>
      </div>
    </div>
  )
}

export default ReadlistItem
