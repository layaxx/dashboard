import { BlitzPage, Routes } from "@blitzjs/next"
import clsx from "clsx"
import { useRouter } from "next/router"
import { SignupForm } from "app/auth/components/SignupForm"
import Layout from "app/core/layouts/Layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div className={clsx(["w-full", "max-w-96"])}>
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => (
  <Layout heading="Signup" title="Sign Up">
    {page}
  </Layout>
)

export default SignupPage
