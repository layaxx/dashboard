import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { ErrorFallbackProps } from "@blitzjs/next"
import clsx from "clsx"
import LoginForm from "app/auth/components/LoginForm"

function CustomErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
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

  return (
    <div className="w-full">
      <h2 className={clsx("font-bold", "text-4xl", "text-center")}>
        {statusCode} - {message}
      </h2>
    </div>
  )
}

export default CustomErrorFallback
