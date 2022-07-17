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
    <NotificationsProvider>
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
        <SharedStateProvider>{getLayout(<Component {...pageProps} />)}</SharedStateProvider>
      </ErrorBoundary>
    </NotificationsProvider>
  )
}

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
