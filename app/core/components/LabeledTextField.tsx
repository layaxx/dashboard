import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import clsx from "clsx"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, reference) => {
    const {
      input,
      meta: { touched, error, submitError, submitting, pristine, valid },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            // eslint-disable-next-line unicorn/no-null
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label {...labelProps} className={clsx("flex", "flex-col", "items-start", "mt-4")}>
          {label}
          <input
            {...input}
            disabled={submitting}
            {...props}
            ref={reference}
            className={clsx(
              "appearance-none",
              "border-2",
              (props.disabled || props["aria-disabled"]) && "border-gray-400",
              !pristine && valid && "border-green-700",
              pristine && !(props.disabled || props["aria-disabled"]) && "border-purple-700",
              touched && normalizedError && "border-red-700",
              "border-solid",
              (props.disabled || props["aria-disabled"]) && "cursor-not-allowed",
              "mt-2",
              "px-2",
              "py-1",
              "rounded-md"
            )}
          />
        </label>

        {touched && normalizedError && (
          <div role="alert" className="text-error">
            {normalizedError}
          </div>
        )}

        <style jsx>{``}</style>
      </div>
    )
  }
)

export default LabeledTextField
