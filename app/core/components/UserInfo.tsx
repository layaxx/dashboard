import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import Link from "next/link"
import Button from "./Button"
import { useCurrentUser } from "../hooks/useCurrentUser"
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
      <Link href={Routes.SignupPage()} passHref>
        <strong>Sign Up</strong>
      </Link>
      <Link href={Routes.LoginPage()} passHref>
        <strong>Login</strong>
      </Link>
    </div>
  )
}

export default UserInfo
