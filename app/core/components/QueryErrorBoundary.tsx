import { AuthenticationError, NotFoundError } from "blitz"
import { HTMLAttributes, PropsWithChildren } from "react"
import { ErrorBoundary } from "@blitzjs/next"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import Button, { ButtonProps } from "./Button"

type Props = {
  buttonProps?: Partial<ButtonProps>
  paragraphProps?: HTMLAttributes<HTMLParagraphElement>
  containerProps?: HTMLAttributes<HTMLDivElement>
}

const QueryErrorBoundary: React.FC<PropsWithChildren<Props>> = ({
  children,
  buttonProps,
  paragraphProps,
  containerProps,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => {
            let content = `Something went wrong (${error.name})`

            if (error instanceof AuthenticationError) {
              content = "You may not access this."
            }

            if (error instanceof NotFoundError) {
              content = "This was not found."
            }

            return (
              <div {...containerProps}>
                <p {...paragraphProps}>{content}</p>
                <Button {...buttonProps} onClick={resetErrorBoundary}>
                  try again
                </Button>
              </div>
            )
          }}
          onReset={reset}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default QueryErrorBoundary
