import React from "react"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import { useRouter } from "next/router"
import { confirmable, ConfirmDialog, createConfirmation } from "react-confirm"
import Button from "app/core/components/Button"
import ButtonGroup from "app/core/components/ButtonGroup"
import GenericModal from "app/core/components/GenericModal"
import { notifyPromise } from "app/core/hooks/notify"
import removeFeedMutation from "app/feeds/mutations/deleteFeed"
import readAllItemsInFeedMutation from "app/feeds/mutations/readAllItemsInFeed"
import { FeedWithEventsAndCount } from "lib/feeds/types"

const Modal: ConfirmDialog<Record<string, never>, boolean> = (props) => {
  if (!props.show) return <></>

  return (
    <GenericModal
      title="Delete Feed"
      cancelButton={{
        handler: () => props.proceed(false),
        props: { autoFocus: true, tabIndex: 22_222 },
        text: "Cancel",
      }}
      confirmButton={{
        handler: () => props.proceed(true),
        props: { tabIndex: 22_223 },
        text: "Delete",
      }}
      drawFocusToCancelButton
    >
      <div className="text-lg">Are you sure you want to delete this feed?</div>
    </GenericModal>
  )
}

const confirm = createConfirmation(confirmable(Modal))

const FeedDangerZone: React.FC<{ feed: FeedWithEventsAndCount }> = ({ feed }) => {
  const [removeFeed] = useMutation(removeFeedMutation)
  const [readAllItemsInFeed] = useMutation(readAllItemsInFeedMutation)

  const router = useRouter()

  const handleDeleteFeed = async () => {
    if (await confirm({})) {
      notifyPromise(removeFeed({ id: feed.id, removeEntries: true }), {
        error: { title: "Failed to remove feed" },
        success: { title: "Successfully removed feed" },
        pending: { title: "Removing feed..." },
      }).then(() => router.push(Routes.FeedsSettingsOverviewPage()))
    }
  }

  const handleMarkAllAsRead = () =>
    notifyPromise(readAllItemsInFeed({ feedId: feed.id }), {
      success: { title: "Success!", message: "fully marked all entries as read" },
      error: { title: "Failed to mark all entries as read" },
      pending: { title: "Marking all entries as read..." },
    })

  return (
    <div className={clsx("flex", "w-full")}>
      <ButtonGroup notRounded>
        <Button onClick={handleDeleteFeed} variant="danger">
          Delete Feed
        </Button>
        <Button onClick={handleMarkAllAsRead}>Mark all entries as read</Button>
      </ButtonGroup>
    </div>
  )
}

export default FeedDangerZone
