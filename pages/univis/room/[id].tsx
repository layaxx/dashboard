import { BlitzPage } from "@blitzjs/next"
import clsx from "clsx"
import he from "he"
import { Room } from "univis-api/dist/tsc/types"
import { gSSP } from "app/blitz-server"
import Layout from "app/core/layouts/Layout"
import getRoom from "app/univis/queries/getRoom"

type Props = { room: Room }

const UnivisRoomPage: BlitzPage<Props> = ({ room }) => {
  return (
    <div className={clsx("sm:text-center", "lg:text-left", "w-full")}>
      <h2 className={clsx("font-bold", "text-2xl")}>
        {he.decode(room.name)} ({he.decode(room.short)})
      </h2>

      <p>Capacity: {room.size ?? "unknown"}</p>

      <iframe
        // eslint-disable-next-line tailwindcss/no-arbitrary-value
        className={clsx("h-[87rem]", "w-full")}
        src={`https://univis.uni-bamberg.de/prg?search=rooms&show=plan&name=${room.short}`}
      ></iframe>
    </div>
  )
}

export const getServerSideProps = gSSP<Props>(async ({ ctx, params }) => {
  try {
    const { room } = await getRoom({ id: params?.id as string }, ctx)

    if (!room) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        room,
      },
    }
  } catch {
    return {
      notFound: true,
    }
  }
})

UnivisRoomPage.suppressFirstRenderFlicker = true
UnivisRoomPage.getLayout = (page) => (
  <Layout heading="UniVis Rooms" title="Univis Rooms">
    {page}
  </Layout>
)

export default UnivisRoomPage
