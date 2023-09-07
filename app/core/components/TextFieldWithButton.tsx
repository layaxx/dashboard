import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import clsx from "clsx"
import { useField, UseFieldConfig } from "react-final-form"
import Button from "./Button"

export interface TextFieldWithButton extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
  button: PropsWithoutRef<JSX.IntrinsicElements["button"]>
}

export const TextFieldWithButton = forwardRef<HTMLInputElement, TextFieldWithButton>(
  ({ name, label, outerProps, fieldProps, labelProps, button, ...props }, reference) => {
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

          <div className={clsx("flex", "items-stretch", "mb-4", "relative", "w-full")}>
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
                "px-2",
                "py-1",
                "rounded-l",
                "w-full"
              )}
            />
            <Button
              {...button}
              notRounded
              className={clsx("sm:ml-0", "mt-0", "mx-0", "rounded-r", button.className)}
            >
              {button.value}
            </Button>
          </div>
        </label>

        {touched && normalizedError && (
          <div role="alert" className="text-error">
            {normalizedError}
          </div>
        )}
      </div>
    )
  }
)

export default TextFieldWithButton
