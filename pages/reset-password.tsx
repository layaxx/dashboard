import { BlitzPage, Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import resetPassword from "app/auth/mutations/resetPassword"
import { ResetPassword } from "app/auth/validations"
import { Form, FORM_ERROR } from "app/core/components/form"
import LabeledTextField from "app/core/components/form/fields/LabeledTextField"
import Layout from "app/core/layouts/Layout"

const ResetPasswordPage: BlitzPage = () => {
  const { query } = useRouter()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <div>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{ password: "", passwordConfirmation: "", token: query.token as string }}
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation(values)
            } catch (error: unknown) {
              if (
                error instanceof Error &&
                "name" in error &&
                error.name === "ResetPasswordError"
              ) {
                return {
                  [FORM_ERROR]: error.message,
                }
              }

              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}
    </div>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => (
  <Layout heading="Reset Password" title="Reset Your Password">
    {page}
  </Layout>
)

export default ResetPasswordPage
