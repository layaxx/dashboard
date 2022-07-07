import { ChangeEventHandler, FC, HTMLAttributes } from "react"
import clsx from "clsx"
import { Field } from "react-final-form"

type FormFieldProps = {
  name: string
  label: string
  type: string
  labelProps?: HTMLAttributes<HTMLLabelElement>
  inputProps?: HTMLAttributes<HTMLInputElement>
  preOnChange?: ChangeEventHandler<HTMLInputElement>
}

const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type,
  labelProps,
  inputProps,
  preOnChange,
}) => {
  if (!preOnChange) {
    preOnChange = (event) => event
  }
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
            meta.dirty && !meta.valid && !meta.modifiedSinceLastSubmit && "text-error",
            labelProps?.className
          )}
        >
          {label}
          <input
            {...inputProps}
            {...input}
            onChange={(event) => input.onChange(preOnChange!(event))}
            className={clsx("text-right", "w-full", inputProps?.className)}
          />
        </label>
      )}
    />
  )
}

export default FormField
