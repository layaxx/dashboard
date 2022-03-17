import { BlitzPage, ErrorComponent } from "blitz"

const SignupPage: BlitzPage = () => {
  return <ErrorComponent statusCode={410} title="Signup has been disabled" />
}

export default SignupPage
