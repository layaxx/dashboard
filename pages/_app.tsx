import { ReactElement, useEffect } from "react"
import { AuthenticationError, AuthorizationError } from "blitz"
import { AppProps, ErrorBoundary, ErrorComponent, ErrorFallbackProps } from "@blitzjs/next"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { NotificationsProvider, setUpNotifications } from "reapop"
import LoginForm from "app/auth/components/LoginForm"
import { withBlitz } from "app/blitz-client"
import { SharedStateProvider } from "app/core/hooks/store"

import "app/core/styles/index.css"

export default withBlitz(({ Component, pageProps }: AppProps) => {
  const getLayout = Component.getLayout || ((page) => page)

  useEffect(() => {
    setUpNotifications({
      defaultProps: {
        position: "top-right",
        dismissible: true,
        dismissAfter: 5000,
        status: "info",
        allowHTML: false,
        showDismissButton: false,
      },
    })
  }, [])

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
        <SharedStateProvider>
          <CustomNotificationsProvider>
            {getLayout(<Component {...pageProps} />)}
          </CustomNotificationsProvider>
        </SharedStateProvider>
      </ErrorBoundary>
    </NotificationsProvider>
  )
})

function CustomNotificationsProvider({ children }: { children: ReactElement }) {
  // FIXME
  return (
    <>
      {/*       <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dismissNotification(id)}
        theme={atalhoTheme}
        components={{
          Notification,
        }}
      /> */}
      {children}
    </>
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
