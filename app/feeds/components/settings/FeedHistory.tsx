import dayjs from "dayjs"
import { FeedLoadEvent } from "db"

const getUpdateMessage = (event: FeedLoadEvent) => {
  const highlightedText = "font-bold"
  if (event.createdIds.length > 0 && event.updatedIds.length > 0) {
    return (
      <>
        Added <span className={highlightedText}>{event.createdIds.length}</span> entries and updated{" "}
        <span className={highlightedText}>{event.updatedIds.length}</span> entries
      </>
    )
  } else if (event.createdIds.length > 0) {
    return (
      <>
        Added <span className={highlightedText}>{event.createdIds.length}</span> entries
      </>
    )
  } else if (event.updatedIds.length > 0) {
    return (
      <>
        Updated <span className={highlightedText}>{event.updatedIds.length}</span> entries
      </>
    )
  } else {
    return "No changes"
  }
}

const FeedHistoryEntry: React.FC<{ event: FeedLoadEvent }> = ({ event }) => {
  const updateMessage = getUpdateMessage(event)

  return (
    <div key={event.id}>
      <p>[{dayjs(event.createdAt).format("DD.MM.YYYY - HH:mm")}]</p>
      <p>{updateMessage}</p>
    </div>
  )
}

const FeedHistory: React.FC<{ loadEvents: FeedLoadEvent[] }> = ({ loadEvents }) => {
  const relevantEvents = loadEvents.filter(
    ({ createdIds, updatedIds }) => createdIds.length > 0 || updatedIds.length > 0
  )
  return (
    <div>
      {relevantEvents.map((event) => (
        <FeedHistoryEntry key={event.id} event={event} />
      ))}
    </div>
  )
}

export default FeedHistory
