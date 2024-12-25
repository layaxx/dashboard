import type { FC, HTMLAttributes } from "react"
import clsx from "clsx"
import { Field } from "react-final-form"

type FormFieldProps = {
  required?: boolean
  name: string
  label: string
  type: string
  placeholder?: string
  labelProps?: HTMLAttributes<HTMLLabelElement>
  inputProps?: HTMLAttributes<HTMLInputElement>
}

const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type,
  labelProps,
  inputProps,
  required,
  placeholder,
}) => {
  const labelContent = required
    ? [
        label,
        <span key="required-indicator" className={clsx("border-red-700", "dark:border-red-800")}>
          *
        </span>,
      ]
    : [label]
  return (
    <Field
      name={name}
      type={type}
      render={({ input, meta }) => (
        <label
          {...labelProps}
          className={clsx(
            "flex",
            "flex-row",
            "flex-wrap",
            type === "checkbox" && "justify-between",
            "mt-4",
            labelProps?.className,
            meta.dirty &&
              !meta.valid &&
              !meta.modifiedSinceLastSubmit && ["border-red-700", "dark:border-red-800"],
          )}
        >
          <span className="min-w-36">{labelContent}</span>
          <input
            {...inputProps}
            {...input}
            onChange={(event) => input.onChange(event)}
            placeholder={placeholder}
            className={clsx(
              inputProps?.className,
              "dark:bg-slate-700",
              type === "checkbox" ? "w-4" : "grow",
              "border-b-2",
              "dark:border-slate-500",
              "dark:text-gray-200",
              "text-right",
            )}
          />
        </label>
      )}
    />
  )
}

export default FormField
