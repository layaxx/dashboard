import { useQuery } from "@blitzjs/rpc"
import clsx from "clsx"
import { Room } from "univis-api/dist/tsc/types"
import LectureTile from "./LectureTile"
import getLectures from "../queries/getLectures"

// eslint-disable-next-line no-magic-numbers
const cacheTime = 1000 * 60 * 60 // one hour

const LectureSearch: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [result] = useQuery(
    getLectures,
    { lecture: searchTerm },
    {
      enabled: !!searchTerm,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      cacheTime,
    },
  )

  const roomMap = new Map<string, Room>()
  if (result?.rooms) {
    result.rooms.forEach((room) => {
      roomMap.set(room._key, room)
    })
  }

  return (
    <div>
      {result?.lectures && result.lectures.length > 0 && (
        <>
          <h3 className={clsx("font-bold", "text-2xl")}>{result.lectures.length} lectures found</h3>
          <div className={clsx("gap-x-4", "gap-y-2", "md:gap-y-8", "grid", "md:grid-cols-2")}>
            {result.lectures.map((lecture) => (
              <LectureTile key={lecture._key} lecture={lecture} roomMap={roomMap} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LectureSearch
