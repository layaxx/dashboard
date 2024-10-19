import React from "react"
import dayjs from "dayjs"
import { FeedLoadEvent } from "db"

const FeedErrors: React.FC<{ errors: FeedLoadEvent[] }> = ({ errors }) => {
  if (errors.length === 0) {
    return <p>Great, there have been no errors with this feed in the past!</p>
  }

  return (
    <>
      {errors.map((error) => (
        <div key={error.id}>
          <p>[{dayjs(error.createdAt).format("DD.MM.YYYY - HH:mm")}]</p>
          <pre className="overflow-auto">
            {JSON.stringify(JSON.parse(error.errors[0] ?? "unknown error"), undefined, 2)}
          </pre>
        </div>
      ))}
    </>
  )
}

export default FeedErrors
