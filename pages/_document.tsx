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
        <link rel="preload" as="font" crossOrigin="" href="/serif.ttf" />
        <body>
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
