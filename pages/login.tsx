import { useEffect } from "react"
import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { LoginForm } from "app/auth/components/LoginForm"
import Layout from "app/core/layouts/Layout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"

  const session = useSession({ suspense: false })

  useEffect(() => {
    if (session.userId) router.push("/")
  }, [session, router])

  return (
    <div>
      <LoginForm onSuccess={() => router.push(next)} />
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
