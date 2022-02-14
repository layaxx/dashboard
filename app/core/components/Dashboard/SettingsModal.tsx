import React from "react"
import clsx from "clsx"
import GenericModal from "../GenericModal"
import { activeFeedID } from "app/core/hooks/feedSlice"
import { useAppSelector } from "app/core/hooks/redux"

type Props = {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = ({ setIsSettingsOpen }: Props) => {
  const activeFeed = useAppSelector(activeFeedID)

  return (
    <GenericModal
      title={`Editing Settings for Feed ${activeFeed}`}
      content={
        <p className={clsx("text-gray-500", "text-sm")}>
          Are you sure you want to deactivate your account? All of your data will be permanently
          removed. This action cannot be undone.
        </p>
      }
      confirmButton={{ handler: console.log, text: "Save Settings" }}
      cancelButton={{ handler: () => setIsSettingsOpen(false), text: "Cancel" }}
    />
  )
}

export default SettingsModal
