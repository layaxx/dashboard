import clsx from "clsx"
import { Dayjs } from "dayjs"
import { timeAsHex } from "."

type Props = {
  time: Dayjs
  close: () => void
}

const FullscreenModal = ({ time, close }: Props) => {
  return (
    <div
      onClick={(event) => {
        console.log("close")
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
        "w-full"
      )}
      style={{ transition: "opacity 0.25s ease" }}
    >
      <div
        className={clsx(
          "caret-transparent",
          "font-bold",
          "h-full",
          "inline-flex",
          "items-center",
          "justify-center",
          "text-5xl",
          "text-center",
          "text-white",
          "w-full"
        )}
        style={{ backgroundColor: "#" + timeAsHex(time) }}
      >
        <p> {timeAsHex(time, { divider: ":", skipSeconds: true })}</p>
      </div>
    </div>
  )
}

export default FullscreenModal
