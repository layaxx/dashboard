import { useEffect } from "react"
import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import clsx from "clsx"
import { useRouter } from "next/router"
import { SignupForm } from "app/auth/components/SignupForm"
import { getRedirectionPath } from "app/auth/redirection"
import Layout from "app/core/layouts/Layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const next = router.query.next ? getRedirectionPath(router.query.next) : "/"

  const session = useSession({ suspense: false })

  useEffect(() => {
    if (session.userId) router.push(next)
  }, [session, router, next])

  return (
    <div className={clsx(["w-full", "max-w-96"])}>
      <SignupForm />
    </div>
  )
}

SignupPage.getLayout = (page) => (
  <Layout heading="Signup" title="Sign Up">
    {page}
  </Layout>
)

export default SignupPage
