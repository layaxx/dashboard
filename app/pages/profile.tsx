import { Suspense } from "react"
import { Head, BlitzPage } from "blitz"
import ChangePasswordForm from "app/core/components/profile/ChangePasswordForm"
import UserSettings from "app/core/components/profile/UserSettings"
import Layout from "app/core/layouts/Layout"

const ProfilePage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div>
        <Suspense fallback="Loading...">
          <UserSettings />
        </Suspense>
      </div>

      <div>
        <ChangePasswordForm />
      </div>
    </>
  )
}

ProfilePage.authenticate = true
ProfilePage.getLayout = (page) => <Layout heading="Profile Settings">{page}</Layout>

export default ProfilePage
