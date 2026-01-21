import { forwardRef, ComponentPropsWithoutRef } from "react"
import clsx from "clsx"
import { Field } from "react-final-form"
import { makeParseFunction } from "lib/form"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<"input"> {
  name: string
  label: string
  type?: "text" | "password" | "email" | "number"
  outerProps?: ComponentPropsWithoutRef<"div">
  labelProps?: ComponentPropsWithoutRef<"label">
}

const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, labelProps, type = "text", ...props }, reference) => {
    return (
      <Field
        name={name}
        type={type}
        parse={makeParseFunction(type)}
        render={({ input, meta: { touched, error, submitError, submitting, pristine, valid } }) => {
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
                    "dark:bg-slate-700",
                    "border-2",
                    !pristine && valid && ["border-green-700", "dark:border-green-800"],
                    pristine &&
                      !(props.disabled || props["aria-disabled"]) && [
                        "border-purple-700",
                        "dark:border-purple-800",
                      ],
                    touched && normalizedError && ["border-red-700", "dark:border-red-800"],
                    (props.disabled || props["aria-disabled"]) && "border-gray-400",
                    "border-solid",
                    (props.disabled || props["aria-disabled"]) && "cursor-not-allowed",
                    "mt-2",
                    "dark:focus:outline-none",
                    "px-2",
                    "py-1",
                    "rounded-md",
                    "w-full"
                  )}
                  type={type}
                />
              </label>

              {touched && normalizedError && (
                <div role="alert" className="text-error">
                  {normalizedError}
                </div>
              )}
            </div>
          )
        }}
      />
    )
  }
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
