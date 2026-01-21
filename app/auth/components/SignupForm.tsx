import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import { getRedirectionParameters } from "../redirection"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { Form, FORM_ERROR } from "app/core/components/form"
import LabeledTextField from "app/core/components/form/fields/LabeledTextField"
import { isKnownRequestError } from "lib/prisma-helpers"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const router = useRouter()
  const loginParameters = getRedirectionParameters(router)

  return (
    <div>
      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error instanceof Error) {
              if (
                isKnownRequestError(error) &&
                error.code === "P2002" &&
                Array.isArray(error.meta?.target) &&
                error.meta?.target?.includes("email")
              ) {
                return { [FORM_ERROR]: "This email is already being used" }
              }

              return { [FORM_ERROR]: error.toString() }
            }

            return { [FORM_ERROR]: "unknown error" }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          outerProps={{ className: "mb-4" }}
        />
      </Form>
      <div className="mt-4">
        Or <Link href={Routes.LoginPage(loginParameters)}>Log In</Link>
      </div>
    </div>
  )
}

export default SignupForm
