import { useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import { useNotifications } from "reapop"
import Form from "../Form"
import LabeledTextField from "../LabeledTextField"
import changeProfileMutation from "app/auth/mutations/changeProfile"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const UserSettings = () => {
  const user = useCurrentUser()

  const [changeProfile] = useMutation(changeProfileMutation)
  const { notify } = useNotifications()

  return (
    <Form
      onSubmit={async ({ name, email }, form) => {
        const errors: { [key: string]: string } = {}
        const { valid, pristine } = form.getState()
        if (!pristine && valid) {
          try {
            form.initialize(await changeProfile({ name, email }))
            notify({
              title: "Successfully changed Profile Settings",
              dismissAfter: 5000,
              dismissible: true,
            })
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
        fieldProps={{ initialValue: user?.email }}
        name={"email"}
      />
      <LabeledTextField
        label="name"
        fieldProps={{ initialValue: user?.name ?? undefined }}
        placeholder="username"
        name={"name"}
      />
      <LabeledTextField
        name="role"
        label="role"
        value={user?.role}
        outerProps={{ "aria-disabled": true }}
        disabled
      />
    </Form>
  )
}

export default UserSettings
