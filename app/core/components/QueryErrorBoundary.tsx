import { AuthenticationError, NotFoundError } from "blitz"
import { HTMLAttributes, PropsWithChildren } from "react"
import { useSession } from "@blitzjs/auth"
import { ErrorBoundary } from "@blitzjs/next"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import Button, { ButtonProps } from "./Button"
import { isKnownRequestError } from "lib/prisma-helpers"
import { reportErrorWebhook } from "lib/reportErrorWebhook"

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
  const session = useSession({ suspense: false })
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onError={(error) => {
            const canSkip =
              error instanceof AuthenticationError && (session.isLoading || !session.userId)
            if (!canSkip) {
              console.warn(error instanceof AuthenticationError, session)
              reportErrorWebhook({ error, boundary: "QueryErrorBoundary" })
            }
          }}
          fallbackRender={({ error, resetErrorBoundary }) => {
            let content = `Something went wrong (${error.name})`

            if (error instanceof AuthenticationError) {
              content = "You may not access this."
              if (session.userId) {
                resetErrorBoundary()
              }
            }

            if (
              error instanceof NotFoundError ||
              (isKnownRequestError(error) && error.code === "P2025") // Specific code for "record not found"
            ) {
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
