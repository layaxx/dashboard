import { useEffect, useState } from "react"
import clsx from "clsx"
import dayjs, { Dayjs } from "dayjs"
import FullscreenModal from "./FullscreenModal"

type Options = { divider?: string; skipSeconds?: boolean }

export const timeAsHex = (time: Dayjs, options?: Options) => {
  const { divider, skipSeconds } = options ?? {}
  if (skipSeconds) {
    return time.format(divider ? "HH" + divider + "mm" : "HHmm")
  }
  return time.format(divider ? "HH" + divider + "mm" + divider + "ss" : "HHmmss")
}

const Zen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [time, setTime] = useState(dayjs())

  useEffect(() => {
    const oneSecond = 1000
    const interval = setInterval(() => setTime(dayjs()), oneSecond)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (isFullscreen) {
    return <FullscreenModal time={time} close={() => setIsFullscreen(false)} />
  }

  return (
    <div
      className={clsx(
        "flex-1",
        "font-bold",
        "inline-flex",
        "items-center",
        "justify-center",
        "text-3xl",
        "text-center",
        "text-white",
        "w-full"
      )}
      style={{ backgroundColor: "#" + timeAsHex(time) }}
      onClick={() => setIsFullscreen((pre) => !pre)}
    >
      <p>{timeAsHex(time, { divider: ":", skipSeconds: true })}</p>
    </div>
  )
}

export default Zen
