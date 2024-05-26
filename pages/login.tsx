import { useEffect } from "react"
import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import clsx from "clsx"
import { useRouter } from "next/router"
import { LoginForm } from "app/auth/components/LoginForm"
import Layout from "app/core/layouts/Layout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"

  const session = useSession({ suspense: false })

  useEffect(() => {
    if (session.userId) router.push(next)
  }, [session, router, next])

  return (
    <div className={clsx(["w-full", "max-w-96"])}>
      <LoginForm />
    </div>
  )
}

LoginPage.getLayout = (page) => (
  <Layout heading="Login" title="Log In">
    {page}
  </Layout>
)
LoginPage.suppressFirstRenderFlicker = true

export default LoginPage
