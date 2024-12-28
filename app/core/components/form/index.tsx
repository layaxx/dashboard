import { validateZodSchema } from "blitz"
import { ReactNode, PropsWithoutRef, ReactChild, MouseEventHandler, FormEvent } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import Button from "../Button"
import ButtonGroup from "../ButtonGroup"

export { FORM_ERROR } from "final-form"

export interface FormProps<S extends z.ZodType<unknown, z.ZodTypeDef>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  deleteText?: string
  onDelete?: MouseEventHandler<HTMLButtonElement>
  resetText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  submitIcon?: ReactChild
  keepDirtyOnReinitialize?: boolean
}

export function Form<S extends z.ZodType<unknown, z.ZodTypeDef>>({
  children,
  submitText,
  submitIcon,
  schema,
  initialValues,
  onSubmit,
  resetText,
  deleteText,
  onDelete,
  keepDirtyOnReinitialize = false,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      keepDirtyOnReinitialize={keepDirtyOnReinitialize}
      render={({ handleSubmit, form, submitting, submitError }) => {
        return (
          <form onSubmit={handleSubmit} {...props}>
            {/* Form fields supplied as children are rendered here */}
            {children}

            {submitError && (
              <div role="alert" className="text-error">
                {submitError}
              </div>
            )}

            <div className="flex">
              <ButtonGroup>
                {submitText && (
                  <Button
                    type="submit"
                    icon={submitIcon}
                    disabled={submitting}
                    className="flex-auto"
                  >
                    {submitText}
                  </Button>
                )}

                {resetText && (
                  <Button
                    type="button"
                    onClick={(event) => {
                      form.reset()
                      if (props.onReset) {
                        props.onReset(event as unknown as FormEvent<HTMLFormElement>)
                      }
                    }}
                    disabled={submitting}
                  >
                    {resetText}
                  </Button>
                )}

                {onDelete && (
                  <Button type="button" onClick={onDelete} variant="danger">
                    {deleteText ?? "Delete"}
                  </Button>
                )}
              </ButtonGroup>
            </div>
          </form>
        )
      }}
    />
  )
}

export default Form
