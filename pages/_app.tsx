import { AuthenticationError, AuthorizationError } from "blitz"
import { AppProps, ErrorBoundary, ErrorComponent, ErrorFallbackProps } from "@blitzjs/next"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { ToastContainer } from "react-toastify"
import LoginForm from "app/auth/components/LoginForm"
import { withBlitz } from "app/blitz-client"
import { SharedStateProvider } from "app/core/hooks/store"

import "react-toastify/dist/ReactToastify.css"
import "app/core/styles/index.css"
import "app/core/styles/notifications.css"

export default withBlitz(({ Component, pageProps }: AppProps) => {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <RootErrorFallback
          error={error}
          getLayout={getLayout}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <ToastContainer />
      <SharedStateProvider>{getLayout(<Component {...pageProps} />)}</SharedStateProvider>
    </ErrorBoundary>
  )
})

interface ICustomErrorFallbackProps extends ErrorFallbackProps {
  getLayout: (component: JSX.Element) => JSX.Element
}
function RootErrorFallback({ error, resetErrorBoundary, getLayout }: ICustomErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return getLayout(<LoginForm onSuccess={resetErrorBoundary} />)
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
