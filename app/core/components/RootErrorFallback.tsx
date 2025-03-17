import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { ErrorComponent, ErrorFallbackProps } from "@blitzjs/next"
import clsx from "clsx"
import LoginForm from "app/auth/components/LoginForm"
import { reportErrorWebhook } from "lib/reportErrorWebhook"

interface ICustomErrorFallbackProps extends ErrorFallbackProps {
  getLayout: (component: JSX.Element) => JSX.Element
}
function RootErrorFallback({ error, resetErrorBoundary, getLayout }: ICustomErrorFallbackProps) {
  reportErrorWebhook({ error, boundary: "RootErrorBoundary" })

  if (error instanceof AuthenticationError) {
    return getLayout(
      <div className={clsx(["w-full", "max-w-96"])}>
        <LoginForm onSuccess={resetErrorBoundary} />
      </div>
    )
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || "400"} title={error.message || error.name} />
    )
  }
}
export default RootErrorFallback
