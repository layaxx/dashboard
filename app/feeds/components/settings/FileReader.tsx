import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react"
import clsx from "clsx"
import { Field, useForm } from "react-final-form"

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  fileInputName?: string
  fileContentName?: string
}

const FileReaderComponent: FC<Props> = ({ fileInputName, fileContentName, ...rest }) => {
  const { change } = useForm()

  return (
    <Field name={fileInputName ?? "file"} type="file">
      {(props) => (
        <input
          {...props.input}
          {...rest}
          className={clsx((props.meta.error || props.meta.invalid) && "text-error", rest.className)}
          onChange={(event) => {
            const reader = new FileReader()

            reader.addEventListener("load", async (event) => {
              const text = event.target?.result
              change(fileContentName ?? "fileContent", text)
            })
            if (event.target?.files && event.target.files[0]) {
              reader.readAsText(event.target.files[0], "utf8")
            }
            props.input.onChange(event)
          }}
        />
      )}
    </Field>
  )
}

export default FileReaderComponent
