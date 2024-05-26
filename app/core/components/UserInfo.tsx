import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import Button from "./Button"
import { useCurrentUser } from "../hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  const message = currentUser ? "You are logged in!" : "You are not logged in."
  const buttons = currentUser ? (
    <Button
      onClick={async () => {
        await logoutMutation()
      }}
    >
      Logout
    </Button>
  ) : (
    <>
      <Button href={Routes.SignupPage()} className="text-nowrap">
        Sign Up
      </Button>
      <Button href={Routes.LoginPage()} className="font-bold">
        Login
      </Button>
    </>
  )

  return (
    <div className={clsx("flex", "h-10")}>
      <span className={clsx("font-bold", "w-1/2")}>{message}</span>
      <div className={clsx("flex", "justify-between", "w-1/2")}>{buttons}</div>
    </div>
  )
}

export default UserInfo
