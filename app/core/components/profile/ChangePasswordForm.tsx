import { useMutation } from "blitz"
import { FORM_ERROR } from "final-form"
import Form from "../Form"
import LabeledTextField from "../LabeledTextField"
import changePasswordMutation from "app/auth/mutations/changePassword"
import { ChangePassword as schema } from "app/auth/validations"

const ChangePasswordForm = () => {
  const [changePassword] = useMutation(changePasswordMutation)

  return (
    <Form
      schema={schema}
      onSubmit={async ({ currentPassword, newPassword, newPasswordConfirm }, form) => {
        const errors: { [key: string]: string } = {}
        const { valid, pristine } = form.getState()
        if (!pristine && valid) {
          try {
            await changePassword({ currentPassword, newPassword, newPasswordConfirm })
          } catch (error) {
            if (error instanceof Error) {
              try {
                const array = JSON.parse(error.message)
                for (const { validation, message } of array) {
                  errors[validation] = message
                }
              } catch {
                return { [FORM_ERROR]: "Failed to Mutate" }
              }
            } else {
              return { [FORM_ERROR]: "Failed to Mutate" }
            }
          }
        }
        return errors
      }}
      submitText="change password"
      resetText="reset form"
    >
      <LabeledTextField label="old password" type="password" name={"currentPassword"} required />
      <LabeledTextField label="new password" type="password" name={"newPassword"} required />
      <LabeledTextField
        label="confirm new password"
        type="password"
        name={"newPasswordConfirm"}
        required
      />
    </Form>
  )
}

export default ChangePasswordForm
