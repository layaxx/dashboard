import React, { FC, HTMLAttributes } from "react"
import clsx from "clsx"
import { Field } from "react-final-form"
import { makeParseFunction } from "lib/form"

type FormFieldProps = {
  required?: boolean
  name: string
  type: string
  placeholder?: string
  labelProps?: HTMLAttributes<HTMLLabelElement>
  inputProps?: HTMLAttributes<HTMLInputElement>
}

const FormField: FC<FormFieldProps> = ({
  name,
  type,
  labelProps,
  inputProps,
  required,
  placeholder,
}) => {
  return (
    <Field
      name={name}
      type={type}
      parse={makeParseFunction(type)}
      render={({ input, meta }) => {
        const showError = meta.dirty && !meta.valid && !meta.modifiedSinceLastSubmit
        return (
          <label
            {...labelProps}
            className={clsx(
              "flex",
              "flex-row",
              "flex-wrap",
              type === "checkbox" && "justify-between",
              labelProps?.className,
              showError && "text-error"
            )}
          >
            <input
              {...inputProps}
              {...input}
              required={required}
              onChange={(event) => input.onChange(event)}
              placeholder={placeholder}
              className={clsx(
                inputProps?.className,
                type === "checkbox" ? "w-4" : "grow",
                showError && ["border-error", "border-b-2"]
              )}
            />
            {showError && (
              <>
                {meta.error && meta.error}
                {meta.submitError && meta.submitError}
              </>
            )}
          </label>
        )
      }}
    />
  )
}

export default FormField
