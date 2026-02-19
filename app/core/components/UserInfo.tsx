"use client"

import { useSession } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import Button from "./Button"
import logout from "app/auth/mutations/logout"

const UserInfo = () => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)

  const message = session.userId ? "You are logged in!" : "You are not logged in."
  const buttons = session.userId ? (
    <Button
      onClick={async () => {
        await logoutMutation()
      }}
      className="flex-auto"
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
    <div className={clsx("flex", "h-10", "dark:text-gray-300")}>
      <span className={clsx("font-bold", "w-1/2")}>{message}</span>
      <div className={clsx("flex", "h-10", "justify-between", "pl-3", "w-1/2")}>{buttons}</div>
    </div>
  )
}

export default UserInfo
