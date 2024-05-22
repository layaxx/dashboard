import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
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
      <Button href={Routes.SignupPage()}>Sign Up</Button>
      <Button href={Routes.LoginPage()} className="font-bold">
        Login
      </Button>
    </div>
  )
}

export default UserInfo
