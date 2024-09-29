/* eslint-disable sort-keys */
import clsx from "clsx"
import { Dayjs } from "dayjs"
import Particles from "react-tsparticles"
import options from "./particleOptions"

type Props = {
  time: Dayjs
  close: () => void
}

const FullscreenModal = ({ time, close }: Props) => {
  return (
    <div
      onClick={(event) => {
        event.preventDefault()
        close()
      }}
      className={clsx(
        "fixed",
        "flex",
        "h-full",
        "items-center",
        "justify-center",
        "left-0",
        "top-0",
        "w-full",
        "z-50",
      )}
      style={{ transition: "opacity 0.25s ease" }}
    >
      <Particles id="tsparticles" options={options as any} />
      <div
        className={clsx(
          "caret-transparent",
          "font-bold",
          "h-full",
          "inline-flex",
          "items-center",
          "justify-center",
          "text-9xl",
          "text-center",
          "text-white",
          "w-full",
        )}
        style={{ backgroundColor: "#" + time.format("HHmmss") }}
      >
        <p>{time.format("HH:mm")}</p>
      </div>
    </div>
  )
}

export default FullscreenModal
