import clsx from "clsx"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { BlitzProvider } from "app/blitz-client"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className={clsx("dark:bg-slate-800", "dark:text-gray-400", "text-gray-900")}>
          <BlitzProvider>
            <Main />
            <NextScript />
          </BlitzProvider>
        </body>
      </Html>
    )
  }
}

export default MyDocument
