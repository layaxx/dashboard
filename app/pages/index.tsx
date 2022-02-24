import { Suspense } from "react"
import { Link, BlitzPage } from "blitz"
import UserInfo from "app/core/components/UserInfo"
import Layout from "app/core/layouts/Layout"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <div>
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>

        <p>
          <Link href="/feeds/rss">
            <a>Feeds</a>
          </Link>
        </p>
      </main>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
