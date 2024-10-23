import clsx from "clsx"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import he from "he"
import { Room } from "univis-api/dist/tsc/types"
import { Lecture, Term } from "lib/univis/types"

dayjs.extend(weekday)

const LectureTile: React.FC<{ lecture: Lecture; roomMap: Map<string, Room> }> = ({
  lecture,
  roomMap,
}) => {
  const convertTerm = (
    term: Term | undefined,
  ): { date: string; startTime?: string; endTime?: string; room: string } => {
    if (!term) {
      return { date: "unknown date", room: "unknown room" }
    }

    let date: string = "unknown date"
    if (term.startdate && term.enddate) {
      date = dayjs(term?.startdate).isSame(dayjs(term?.enddate), "day")
        ? dayjs(term.startdate).format("DD.MM.YY")
        : `${dayjs(term.startdate).format("DD.MM")} - ${dayjs(term.enddate).format("DD.MM.YY")}`
    } else {
      const weekdayString = term?.repeat?.split(" ").at(-1)
      const weekdayNumber = Number(weekdayString)
      date = dayjs().weekday(weekdayNumber).format("ddd")
    }

    const room = roomMap.get(term?.room?.UnivISRef._key ?? "invalid")
    let roomString
    if (!room) {
      roomString = "unknown room"
    } else {
      roomString =
        room.name && room.short && room.name !== room.short
          ? `${he.decode(room.name)} (${he.decode(room.short)})`
          : `${he.decode(room.short ?? room.name ?? "unknown room")}`
    }
    return {
      date,
      startTime: term?.starttime,
      endTime: term?.endtime,
      room: roomString,
    }
  }

  const entries = Array.isArray(lecture.terms?.term)
    ? lecture.terms?.term.map((term) => convertTerm(term)) ?? []
    : [convertTerm(lecture.terms?.term)]

  return (
    <div className={clsx("border-purple-700", "border-t-4", "p-2", "rounded", "shadow-md")}>
      <h4 className={clsx("font-bold", "text-lg")}>
        {he.decode(lecture.name)} - ({he.decode(lecture.type)})
      </h4>
      {entries.map(({ date, startTime, endTime, room }) => (
        <p key={date + room}>
          {date}, {startTime ?? "unknown time"}-{endTime ?? "unknown time"} - {room}
        </p>
      ))}
    </div>
  )
}

export default LectureTile
