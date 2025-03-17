import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import clsx from "clsx"
import he from "he"
import Link from "next/link"
import getRooms from "../queries/getRooms"

// eslint-disable-next-line no-magic-numbers
const cacheTime = 1000 * 60 * 60 // one hour

const RoomSearch: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [result] = useQuery(
    getRooms,
    { room: searchTerm },
    {
      enabled: !!searchTerm,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      cacheTime,
    }
  )

  return (
    <div>
      {result?.rooms && result.rooms.length > 0 && (
        <>
          <h3 className={clsx("font-bold", "text-2xl")}>{result.rooms.length} rooms found</h3>
          <div className={clsx("gap-x-4", "gap-y-2", "md:gap-y-8", "grid", "md:grid-cols-2")}>
            {result.rooms.map((room) => (
              <Link
                key={room.short}
                href={Routes.UnivisRoomPage({ id: room.id })}
                className="underline"
              >
                {he.decode(room.name ?? "")} ({he.decode(room.short)})
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RoomSearch
