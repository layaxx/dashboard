import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { ErrorFallbackProps } from "@blitzjs/next"
import clsx from "clsx"
import CustomErrorComponent from "../components/CustomErrorComponent"
import LoginForm from "app/auth/components/LoginForm"
import { reportErrorWebhook } from "lib/reportErrorWebhook"

function CustomErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  reportErrorWebhook({ error, boundary: "CustomErrorFallback" })

  const statusCode = error.statusCode || "400"
  let message = error.message || error.name || "An error occurred"
  if (error instanceof AuthenticationError) {
    return (
      <div className={clsx(["w-full", "max-w-96"])}>
        <LoginForm onSuccess={resetErrorBoundary} />
      </div>
    )
  } else if (error instanceof AuthorizationError) {
    message = "Sorry, you are not authorized to access this"
  }

  return <CustomErrorComponent statusCode={statusCode} message={message} />
}

export default CustomErrorFallback
