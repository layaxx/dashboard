import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import clsx from "clsx"
import { Field } from "react-final-form"
import { twMerge } from "tailwind-merge"
import Button, { ButtonProps } from "../../Button"
import { makeParseFunction } from "lib/form"

export interface ITextFieldWithButton extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  button: PropsWithoutRef<Omit<ButtonProps, "children">>
}

const TextFieldWithButton = forwardRef<HTMLInputElement, ITextFieldWithButton>(
  ({ name, label, outerProps, labelProps, button, type = "text", ...props }, reference) => {
    return (
      <Field
        name={name}
        type={type}
        parse={makeParseFunction(type)}
        render={({ input, meta }) => {
          const normalizedError = Array.isArray(meta.error)
            ? meta.error.join(", ")
            : meta.error || meta.submitError

          return (
            <div {...outerProps}>
              <label {...labelProps} className={clsx("flex", "flex-col", "items-start", "mt-4")}>
                {label}

                <div className={clsx("flex", "items-stretch", "mb-4", "relative", "w-full")}>
                  <input
                    {...input}
                    disabled={meta.submitting}
                    {...props}
                    ref={reference}
                    className={clsx(
                      "appearance-none",
                      "dark:bg-slate-700",
                      "border-2",
                      (props.disabled || props["aria-disabled"]) && "border-gray-400",
                      !meta.pristine && meta.valid && ["border-green-700", "dark:border-green-800"],
                      meta.pristine &&
                        !(props.disabled || props["aria-disabled"]) && [
                          "border-purple-700",
                          "dark:border-purple-800",
                        ],
                      meta.touched && normalizedError && ["border-red-700", "dark:border-red-800"],
                      "border-solid",
                      (props.disabled || props["aria-disabled"]) && "cursor-not-allowed",
                      "dark:focus:outline-none",
                      "px-2",
                      "py-1",
                      "rounded-l",
                      "w-full",
                    )}
                    type={type}
                  />
                  <Button
                    {...button}
                    rounded="right"
                    className={twMerge(clsx("ml-0", "sm:ml-0", "mt-0", "mx-0"), button.className)}
                  >
                    {button.value}
                  </Button>
                </div>
              </label>

              {meta.touched && normalizedError && (
                <div role="alert" className="text-error">
                  {normalizedError}
                </div>
              )}
            </div>
          )
        }}
      />
    )
  },
)

TextFieldWithButton.displayName = "TextFieldWithButton"

export default TextFieldWithButton
