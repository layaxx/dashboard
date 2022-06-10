import React from "react"
import clsx from "clsx"
import GenericModal from "../GenericModal"
import { useSharedState } from "app/core/hooks/store"

type Props = {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsModal = ({ setIsSettingsOpen }: Props) => {
  const [{ activeFeedID }] = useSharedState()

  return (
    <GenericModal
      title={`Editing Settings for Feed ${activeFeedID}`}
      confirmButton={{ handler: console.log, text: "Save Settings" }}
      cancelButton={{ handler: () => setIsSettingsOpen(false), text: "Cancel" }}
    >
      <p className={clsx("text-gray-500", "text-sm")}>{/* TODO: What about this? */}</p>
    </GenericModal>
  )
}

export default SettingsModal
