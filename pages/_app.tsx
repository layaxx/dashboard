import { AppProps, ErrorBoundary } from "@blitzjs/next"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { ToastContainer } from "react-toastify"
import { withBlitz } from "app/blitz-client"
import RootErrorFallback from "app/core/components/RootErrorFallback"
import { SharedStateProvider } from "app/core/hooks/store"
import { reportErrorWebhook } from "lib/reportErrorWebhook"

import "react-toastify/dist/ReactToastify.css"
import "app/core/styles/index.css"
import "app/core/styles/notifications.css"

export default withBlitz(({ Component, pageProps }: AppProps) => {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary
      onError={(error) => {
        reportErrorWebhook({ error, boundary: "RootErrorBoundary" })
      }}
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
