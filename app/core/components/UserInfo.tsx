"use client"

import { useSession } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import clsx from "clsx"
import Button from "./Button"
import logout from "app/auth/mutations/logout"

const isDemoMode = process.env.NEXT_PUBLIC_IS_DEMO_MODE === "true"

const UserInfo = () => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)

  const isLoggedIn = !!session.userId

  const message = isLoggedIn ? "You are logged in!" : "You are not logged in."
  const buttons = isLoggedIn ? (
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
      {!isDemoMode && (
        <Button href={Routes.SignupPage()} className="text-nowrap">
          Sign Up
        </Button>
      )}
      <Button href={Routes.LoginPage()} className="font-bold">
        {isDemoMode ? "Login as Demo" : "Login"}
      </Button>
    </>
  )

  return (
    <div className={clsx("flex", "h-10", "dark:text-gray-300")}>
      <span className={clsx("font-bold", "w-1/2")}>{message}</span>
      <div className={clsx("flex", "gap-4", "h-10", "justify-end", "pl-3", "w-1/2")}>{buttons}</div>
    </div>
  )
}

export default UserInfo
