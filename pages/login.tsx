import { useRedirectAuthenticated } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { LoginForm } from "app/auth/components/LoginForm"
import Layout from "app/core/layouts/Layout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"

  useRedirectAuthenticated(next)

  return (
    <div>
      <LoginForm />
    </div>
  )
}

LoginPage.getLayout = (page) => (
  <Layout heading="Login" title="Log In">
    {page}
  </Layout>
)

export default LoginPage
