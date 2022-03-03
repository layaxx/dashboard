import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import { NotificationsProvider } from "reapop"
import LoginForm from "app/auth/components/LoginForm"

import "app/core/styles/index.css"
import { SharedStateProvider } from "app/core/hooks/store"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <NotificationsProvider>
        <SharedStateProvider>{getLayout(<Component {...pageProps} />)}</SharedStateProvider>
      </NotificationsProvider>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
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
