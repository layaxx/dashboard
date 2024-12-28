import { useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import { z } from "zod"
import Form from "../form"
import LabeledTextField from "../form/fields/LabeledTextField"
import changeProfileMutation from "app/auth/mutations/changeProfile"
import notify from "app/core/hooks/notify"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const UserSettings = () => {
  const user = useCurrentUser()

  const [changeProfile] = useMutation(changeProfileMutation)

  return (
    <Form
      schema={z.object({ name: z.string(), email: z.string().email() })}
      onSubmit={async ({ name, email }, form) => {
        const errors: { [key: string]: string } = {}
        const { valid, pristine } = form.getState()
        if (!pristine && valid) {
          try {
            const result = await changeProfile({ name, email })
            form.initialize({ name: result.name ?? "", email: result.email })
            notify("Successfully changed Profile Settings", { status: "success" })
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
        outerProps={{ "aria-disabled": true, className: "mb-4" }}
        disabled
      />
    </Form>
  )
}

export default UserSettings
