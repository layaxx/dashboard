import { ReactNode, PropsWithoutRef, ReactChild } from "react"
import { validateZodSchema } from "blitz"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import Button from "./Button"

export { FORM_ERROR } from "final-form"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  resetText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  submitIcon?: ReactChild
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  submitIcon,
  schema,
  initialValues,
  onSubmit,
  resetText,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, submitError, pristine }) => (
        <form onSubmit={handleSubmit} {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          <div className="mt-4">
            {submitText && (
              <Button
                type="submit"
                variant="primary"
                icon={submitIcon}
                disabled={submitting || pristine}
              >
                {submitText}
              </Button>
            )}

            {resetText && (
              <Button type="button" onClick={form.reset} disabled={submitting || pristine}>
                Reset
              </Button>
            )}
          </div>
        </form>
      )}
    />
  )
}

export default Form
