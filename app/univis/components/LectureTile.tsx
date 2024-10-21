import clsx from "clsx"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import he from "he"
import { Room } from "univis-api/dist/tsc/types"
import { Lecture } from "lib/univis/types"

dayjs.extend(weekday)

const LectureTile: React.FC<{ lecture: Lecture; room?: Room }> = ({ lecture, room }) => {
  let weekday: string
  try {
    const weekdayNumber = Number(lecture.terms?.term.repeat.split(" ").at(-1))

    weekday = dayjs().weekday(weekdayNumber).format("ddd")
  } catch {
    weekday = "unknown day"
  }
  return (
    <div className={clsx("border-purple-700", "border-t-4", "p-2", "rounded", "shadow-md")}>
      <h4 className={clsx("font-bold", "text-lg")}>
        {he.decode(lecture.name)} - ({he.decode(lecture.type)})
      </h4>
      <p>
        {weekday}, {lecture.terms?.term.starttime ?? "unknown time"}-
        {lecture.terms?.term.endtime ?? "unknown time"} - {he.decode(room?.short ?? "unknown room")}
      </p>
    </div>
  )
}

export default LectureTile
