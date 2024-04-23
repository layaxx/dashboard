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
    <div className={clsx("flex", "h-10", "justify-between")}>
      <strong>You are logged in!</strong>
      <Button
        onClick={async () => {
          await logoutMutation()
        }}
      >
        Logout
      </Button>
    </div>
  ) : (
    <div className={clsx("flex", "h-10", "justify-between")}>
      <strong>You are not logged in.</strong>
      <Link href={Routes.SignupPage()} passHref>
        <Button>Sign Up</Button>
      </Link>
      <Link href={Routes.LoginPage()} passHref>
        <Button className="font-bold">Login</Button>
      </Link>
    </div>
  )
}

export default UserInfo
