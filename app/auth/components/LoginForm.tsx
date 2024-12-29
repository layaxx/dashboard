import { AuthenticationError, PromiseReturnType } from "blitz"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import { getRedirectionPath } from "../redirection"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Form, FORM_ERROR } from "app/core/components/form"
import LabeledTextField from "app/core/components/form/fields/LabeledTextField"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()

  let redirect: { next: string } | undefined
  if (router.query.next) {
    redirect = { next: getRedirectionPath(router.query.next) }
  } else if (router.pathname !== Routes.LoginPage().pathname) {
    redirect = { next: router.pathname }
  }

  return (
    <div>
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error) {
            return error instanceof AuthenticationError
              ? { [FORM_ERROR]: "Sorry, those credentials are invalid" }
              : {
                  [FORM_ERROR]:
                    "Sorry, we had an unexpected error. Please try again. - " +
                    (error instanceof Error ? error.toString() : "unknown error"),
                }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          outerProps={{ className: "mb-4" }}
        />
      </Form>

      <div className="mt-4">
        Or <Link href={Routes.SignupPage(redirect)}>Sign Up</Link>
      </div>
    </div>
  )
}

export default LoginForm
