import { useMutation } from "blitz"
import { FORM_ERROR } from "final-form"
import Form from "../Form"
import LabeledTextField from "../LabeledTextField"
import changeProfileMutation from "app/auth/mutations/changeProfile"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const UserSettings = () => {
  const currentUser = useCurrentUser()

  const [changeProfile] = useMutation(changeProfileMutation)

  return (
    <Form
      onSubmit={async ({ name, email }, form) => {
        const errors: { [key: string]: string } = {}
        const { valid, pristine } = form.getState()
        if (!pristine && valid) {
          try {
            form.initialize(await changeProfile({ name, email }))
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
      submitText="submit changes"
      resetText="reset"
    >
      <LabeledTextField
        label="email"
        type="email"
        fieldProps={{ initialValue: currentUser?.email }}
        name={"email"}
      />
      <LabeledTextField
        label="name"
        fieldProps={{ initialValue: currentUser?.name ?? undefined }}
        placeholder="username"
        name={"name"}
      />
      <LabeledTextField
        name="role"
        label="role"
        value={currentUser?.role}
        outerProps={{ "aria-disabled": true }}
        disabled
      />
    </Form>
  )
}

export default UserSettings
