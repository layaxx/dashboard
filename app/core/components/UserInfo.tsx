import { useMutation, Link, Routes } from "blitz"
import clsx from "clsx"
import { useCurrentUser } from "../hooks/useCurrentUser"
import Button from "./Button"
import logout from "app/auth/mutations/logout"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return currentUser ? (
    <Button
      onClick={async () => {
        await logoutMutation()
      }}
    >
      Logout
    </Button>
  ) : (
    <div className={clsx("flex", "justify-between")}>
      <Link href={Routes.SignupPage()}>
        <a>
          <strong>Sign Up</strong>
        </a>
      </Link>
      <Link href={Routes.LoginPage()}>
        <a>
          <strong>Login</strong>
        </a>
      </Link>
    </div>
  )
}

export default UserInfo
