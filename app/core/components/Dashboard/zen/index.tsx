import { useEffect, useState } from "react"
import clsx from "clsx"
import dayjs from "dayjs"
import FullscreenModal from "./FullscreenModal"

const Zen: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [time, setTime] = useState(dayjs())
  const [hasAttached, setHasAttached] = useState(false)

  useEffect(() => {
    const threeSeconds = 3000
    const interval = setInterval(() => setTime(dayjs()), threeSeconds)
    setHasAttached(true)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (isFullscreen) {
    return <FullscreenModal time={time} close={() => setIsFullscreen(false)} />
  }

  return (
    <div
      suppressHydrationWarning
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
      style={{ backgroundColor: "#" + time.format("HHmmss") }}
      onClick={() => setIsFullscreen((pre) => !pre)}
    >
      <p>{hasAttached ? time.format("HH:mm") : "00:00"}</p>
    </div>
  )
}

export default Zen
